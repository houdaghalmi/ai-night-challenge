import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import UserSchema from '@/models/UserSchema';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user preferences
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const userPrefs = await UserSchema.findById(userId);

    // If no preferences yet, return basic recommendations without user customization
    if (!userPrefs) {
      console.warn('No user preferences found for:', session.user.id);
      // Continue with generic scoring instead of failing
    }

    // Get all destinations
    const destinations = await Destination.find();

    // Calculate relevance score for each destination
    const scoredDestinations = destinations.map((dest) => {
      let score = 0;

      // Use defaults if no user preferences
      const interests = userPrefs?.interests || {};
      const budgetRange = userPrefs?.travelPreferences?.budgetRange || 'medium';
      const preferredRegions = userPrefs?.travelPreferences?.preferredRegions || [];
      const crowdTolerance = userPrefs?.travelStyle?.crowdTolerance || 'neutral';
      const activityIntensity = userPrefs?.travelStyle?.activityIntensity || 'moderate';
      const travelDuration = userPrefs?.travelPreferences?.travelDuration || 7;

      // 1. Interest alignment (20 points max)
      const interestScores = {
        beach: dest.bestFor?.includes('beach') ? 5 : 0,
        cultureHistory: dest.bestFor?.includes('cultureHistory') ? 5 : 0,
        desertAdventure: dest.bestFor?.includes('desertAdventure') ? 5 : 0,
        foodGastronomy: dest.bestFor?.includes('food') ? 5 : 0,
        nightlife: dest.bestFor?.includes('nightlife') ? 3 : 0,
        natureMountains: dest.bestFor?.includes('nature') ? 5 : 0,
        shopping: dest.bestFor?.includes('shopping') ? 3 : 0,
        relaxationSpa: dest.bestFor?.includes('relaxation') || dest.bestFor?.includes('spa') ? 5 : 0,
      };

      Object.keys(interestScores).forEach((key) => {
        if (interests[key] > 0) {
          score += (interestScores[key] || 0) * (interests[key] / 5);
        }
      });

      // 2. Budget alignment (15 points max)
      const budgetMap = {
        low: ['Budget'],
        medium: ['Moderate', 'Budget'],
        high: ['Premium', 'Moderate', 'Budget'],
        luxury: ['Luxury', 'Premium', 'Budget'],
      };
      const budgetTypes = budgetMap[budgetRange] || budgetMap['medium'];
      const budgetMatch = dest.budgetLevels?.some((b) => budgetTypes.includes(b)) ? 15 : 5;
      score += budgetMatch;

      // 3. Region preference (10 points max)
      if (preferredRegions.length > 0) {
        if (dest.region === preferredRegions[0]) {
          score += 10;
        } else if (preferredRegions.includes(dest.region)) {
          score += 7;
        }
      } else {
        score += 5; // Neutral if no preference
      }

      // 4. Travel style match (15 points max)
      let styleScore = 0;

      // Crowd tolerance
      const crowdMap = {
        avoid_crowds: 'quiet',
        neutral: 'moderate',
        popular_spots: 'touristy',
      };
      const expectedCrowd = crowdMap[crowdTolerance] || crowdMap['neutral'];
      if (dest.crowdLevel === expectedCrowd) {
        styleScore += 5;
      } else if (
        (expectedCrowd === 'quiet' && dest.crowdLevel === 'moderate') ||
        (expectedCrowd === 'moderate' && ['quiet', 'touristy'].includes(dest.crowdLevel)) ||
        (expectedCrowd === 'touristy' && dest.crowdLevel === 'moderate')
      ) {
        styleScore += 3;
      }

      // Activity level
      const activityMap = {
        relaxed: 'relaxed',
        moderate: 'moderate',
        adventurous: 'adventurous',
      };
      const expectedActivity = activityMap[activityIntensity] || activityMap['moderate'];
      if (dest.activityLevel === expectedActivity) {
        styleScore += 5;
      } else if (
        (expectedActivity === 'relaxed' && dest.activityLevel === 'moderate') ||
        (expectedActivity === 'moderate' && ['relaxed', 'adventurous'].includes(dest.activityLevel)) ||
        (expectedActivity === 'adventurous' && dest.activityLevel === 'moderate')
      ) {
        styleScore += 3;
      }

      score += styleScore;

      // 5. Trip duration bonus (10 points max)
      if (travelDuration <= 3 && dest.travelTime?.fromTunis?.includes('1')) {
        score += 8;
      } else if (travelDuration <= 5 && dest.travelTime?.fromTunis?.includes('2')) {
        score += 6;
      } else if (travelDuration > 7) {
        score += 5;
      }

      // 6. Family friendly bonus (5 points)
      if (userPrefs?.travelPreferences?.travelerType === 'family' && dest.familyFriendly) {
        score += 5;
      }

      return {
        ...dest.toObject(),
        relevanceScore: Math.min(100, Math.round(score)),
      };
    });

    // Sort by relevance score (descending)
    let sortedRecommendations = scoredDestinations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 30); // Top 30 recommendations

    // Fetch images from Unsplash API for each recommendation
    sortedRecommendations = await Promise.all(
      sortedRecommendations.map(async (rec) => {
        try {
          const searchTerm = rec.placeType ? rec.placeType.replace(/_/g, ' ') : rec.name;
          const imageUrl = await fetchImageFromUnsplash(searchTerm);
          return {
            ...rec,
            imageUrl: imageUrl,
          };
        } catch (err) {
          console.error('Error fetching image for', rec.name, err.message);
          return rec;
        }
      })
    );

    return Response.json(
      {
        recommendations: sortedRecommendations,
        count: sortedRecommendations.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Recommendations error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// Fetch image from Unsplash API
async function fetchImageFromUnsplash(query) {
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || 'PVJKjFyF1NfKJ7dJkLNaUlH6Gaj5dCVwHfRbI3yBWYw';
  
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${unsplashAccessKey}`;
    const response = await fetch(url, {
      headers: {
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return null;
  } catch (error) {
    console.error('Unsplash fetch error:', error.message);
    return null;
  }
}
