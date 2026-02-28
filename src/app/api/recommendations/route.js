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

    if (!userPrefs) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all destinations
    const destinations = await Destination.find();

    // Calculate relevance score for each destination
    const scoredDestinations = destinations.map((dest) => {
      let score = 0;

      // 1. Interest alignment (20 points max)
      const interestScores = {
        beach: ['coast', 'Hammamet', 'Djerba', 'Sousse', 'Mahdia'].includes(dest.name) ? 5 : 0,
        cultureHistory: dest.bestFor?.includes('cultureHistory') ? 5 : 0,
        desertAdventure: dest.bestFor?.includes('desertAdventure') ? 5 : 0,
        foodGastronomy: dest.bestFor?.includes('food') ? 5 : 0,
        nightlife: dest.bestFor?.includes('nightlife') ? 3 : 0,
        natureMountains: dest.bestFor?.includes('nature') ? 5 : 0,
        shopping: dest.bestFor?.includes('shopping') ? 3 : 0,
        relaxationSpa: dest.bestFor?.includes('relaxation') ? 5 : 0,
      };

      const userInterests = userPrefs.interests || {};
      Object.keys(userInterests).forEach((key) => {
        if (userInterests[key] > 0) {
          score += (interestScores[key] || 0) * (userInterests[key] / 5);
        }
      });

      // 2. Budget alignment (15 points max)
      const budgetMap = {
        low: ['Budget'],
        medium: ['Moderate', 'Budget'],
        high: ['Premium', 'Moderate', 'Budget'],
        luxury: ['Luxury', 'Premium'],
      };
      const userBudget = userPrefs.travelPreferences?.budgetRange || 'medium';
      const budgetTypes = budgetMap[userBudget] || [];
      const budgetMatch = dest.budgetLevels?.some((b) => budgetTypes.includes(b)) ? 15 : 5;
      score += budgetMatch;

      // 3. Region preference (10 points max)
      if (dest.region === userPrefs.travelPreferences?.preferredRegions?.[0]) {
        score += 10;
      } else if (userPrefs.travelPreferences?.preferredRegions?.includes(dest.region)) {
        score += 7;
      }

      // 4. Travel style match (15 points max)
      let styleScore = 0;

      // Crowd tolerance
      const crowdMap = {
        avoid_crowds: 'quiet',
        neutral: 'moderate',
        popular_spots: 'touristy',
      };
      const expectedCrowd = crowdMap[userPrefs.travelStyle?.crowdTolerance];
      if (dest.crowdLevel === expectedCrowd) {
        styleScore += 5;
      } else if (
        (expectedCrowd === 'quiet' && dest.crowdLevel === 'moderate') ||
        (expectedCrowd === 'moderate' && ['quiet', 'touristy'].includes(dest.crowdLevel))
      ) {
        styleScore += 3;
      }

      // Activity level
      const activityMap = {
        relaxed: 'relaxed',
        moderate: 'moderate',
        adventurous: 'adventurous',
      };
      const expectedActivity = activityMap[userPrefs.travelStyle?.activityIntensity];
      if (dest.activityLevel === expectedActivity) {
        styleScore += 5;
      } else if (
        (expectedActivity === 'relaxed' && dest.activityLevel === 'moderate') ||
        (expectedActivity === 'moderate' && ['relaxed', 'adventurous'].includes(dest.activityLevel))
      ) {
        styleScore += 3;
      }

      // Accommodation match
      const hasPreferredAccommodation = dest.accommodationTypes?.some((a) =>
        userPrefs.travelStyle?.accommodationType?.includes(a)
      );
      if (hasPreferredAccommodation) {
        styleScore += 5;
      }

      score += styleScore;

      // 5. Trip duration bonus (10 points max)
      const tripDays = userPrefs.travelPreferences?.travelDuration || 7;
      if (tripDays <= 3 && dest.travelTime?.fromTunis?.includes('1 hour')) {
        score += 8;
      } else if (tripDays <= 5 && dest.travelTime?.fromTunis?.includes('2 hours')) {
        score += 6;
      } else if (tripDays > 7) {
        score += 5; // Longer trips can handle longer travel
      }

      // 6. Family friendly bonus (5 points)
      if (userPrefs.travelPreferences?.travelerType === 'family' && dest.familyFriendly) {
        score += 5;
      }

      return {
        ...dest.toObject(),
        relevanceScore: Math.min(100, Math.round(score)),
      };
    });

    // Sort by relevance score (descending)
    const sortedRecommendations = scoredDestinations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10); // Top 10 recommendations

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
