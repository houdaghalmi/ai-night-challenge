import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import UserSchema from '@/models/UserSchema';
import mongoose from 'mongoose';

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

// Tunisia regions with coordinates
const TUNISIA_REGIONS = {
  north: { 
    lat: 36.8, 
    lng: 10.3, 
    keyword: 'tourist attractions Tunis Bizerte Tabarka',
  },
  coast: {
    lat: 35.8,
    lng: 10.6,
    keyword: 'beach resorts Hammamet Sousse Mahdia Monastir',
  },
  historical_cities: {
    lat: 35.8,
    lng: 10.1,
    keyword: 'historical sites museums Kairouan Carthage',
  },
  desert: {
    lat: 33.7,
    lng: 8.7,
    keyword: 'Sahara desert oasis Tozeur Douz Tataouine',
  },
  south: {
    lat: 32.8,
    lng: 10.3,
    keyword: 'Matmata Tataouine southern Tunisia',
  },
};

// Map interests to Google Places search keywords
const INTEREST_KEYWORDS = {
  beach: ['beach', 'water sports', 'resort', 'swimming'],
  cultureHistory: ['museum', 'historical site', 'monument', 'archaeological'],
  desertAdventure: ['desert', 'sand dune', 'adventure', 'oasis'],
  foodGastronomy: ['restaurant', 'market', 'food tour', 'local cuisine'],
  nightlife: ['bar', 'restaurant', 'nightclub', 'entertainment'],
  natureMountains: ['mountain', 'hiking trail', 'national park', 'nature'],
  shopping: ['market', 'shopping', 'souq', 'bazaar'],
  relaxationSpa: ['spa', 'wellness', 'hot spring', 'resort'],
};

async function searchGooglePlaces(region, keywords) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured');
    return [];
  }

  const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const regionData = TUNISIA_REGIONS[region] || TUNISIA_REGIONS.coast;

  try {
    const searchQuery = `${regionData.keyword} ${keywords.join(' ')}`;
    const url = new URL(BASE_URL);
    url.searchParams.append('location', `${regionData.lat},${regionData.lng}`);
    url.searchParams.append('radius', '50000');
    url.searchParams.append('keyword', searchQuery);
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Google Places API error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Google Places search error:', error);
    return [];
  }
}

function calculatePlaceScore(place, userPreferences) {
  let score = 0;

  // Extract place type
  const placeTypes = place.types || [];
  const placeName = place.name.toLowerCase();

  // Interest matching (20 pts max)
  const interests = userPreferences.interests || {};
  Object.entries(interests).forEach(([interest, rating]) => {
    if (rating > 0) {
      const keywords = INTEREST_KEYWORDS[interest] || [];
      const hasMatch = keywords.some(
        kw => placeName.includes(kw) || placeTypes.some(t => t.includes(kw))
      );
      if (hasMatch) {
        score += (rating / 5) * 4; // Scale 0-4 points per interest
      }
    }
  });

  // Rating bonus (10 pts max)
  if (place.rating) {
    score += (place.rating / 5) * 10;
  }

  // Popularity bonus (5 pts max)
  if (place.user_ratings_total > 100) {
    score += 5;
  } else if (place.user_ratings_total > 50) {
    score += 3;
  } else if (place.user_ratings_total > 10) {
    score += 1;
  }

  // Open now bonus (5 pts)
  if (place.opening_hours?.open_now === true) {
    score += 5;
  }

  return Math.min(score, 100); // Cap at 100
}

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

    // If no Google API key, return error to trigger fallback
    if (!GOOGLE_PLACES_API_KEY) {
      return Response.json(
        {
          error: 'Google Places API not configured',
          message: 'Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to .env.local',
          recommendations: [],
        },
        { status: 503 } // Service Unavailable - triggers fallback
      );
    }

    const prefs = userPrefs.travelPreferences || {};
    const interests = userPrefs.interests || {};
    const regions = prefs.preferredRegions || ['coast'];

    // Collect recommendations from all user preferred regions
    const allPlaces = [];

    for (const region of regions) {
      // Get top 3 interests
      const topInterests = Object.entries(interests)
        .filter(([_, rating]) => rating > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([interest]) => interest);

      const keywords =
        topInterests.length > 0
          ? topInterests.flatMap(i => INTEREST_KEYWORDS[i] || [])
          : ['tourist attraction'];

      const places = await searchGooglePlaces(region, keywords);
      allPlaces.push(...places);
    }

    // Remove duplicates by place_id
    const uniquePlaces = Array.from(
      new Map(allPlaces.map(p => [p.place_id, p])).values()
    );

    // Score and rank
    const scoredPlaces = uniquePlaces
      .map(place => ({
        ...place,
        relevanceScore: calculatePlaceScore(place, {
          interests,
          travelStyle: userPrefs.travelStyle || {},
          travelPreferences: prefs,
        }),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    return Response.json({ recommendations: scoredPlaces }, { status: 200 });
  } catch (error) {
    console.error('Recommendation error:', error);
    return Response.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
