import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]/route';
import UserSchema from '@/models/UserSchema';
import mongoose from 'mongoose';

// Simple debug endpoint to seed and check recommendations
export async function GET(request) {
  try {
    await dbConnect();
    
    // Check if destinations exist
    const destCount = await Destination.countDocuments();
    
    // Get session user
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    let userPrefs = null;
    if (userId) {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      userPrefs = await UserSchema.findById(userObjectId);
    }

    return Response.json({
      status: 'OK',
      databases: {
        destinationsCount: destCount,
        destinationsSeeded: destCount > 0,
      },
      user: {
        id: userId || 'not-logged-in',
        hasPreferences: !!userPrefs,
        preferences: userPrefs ? {
          travelPreferences: userPrefs.travelPreferences,
          interests: userPrefs.interests,
          travelStyle: userPrefs.travelStyle,
        } : null,
      },
      message: destCount === 0 
        ? 'No destinations found. Run POST /api/debug-setup to seed.' 
        : `${destCount} destinations found`,
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      step: 'initialization',
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    // Clear and seed destinations
    await Destination.deleteMany({});

    const destinationsData = [
      {
        name: 'Hammamet',
        region: 'coast',
        description: 'Beautiful Mediterranean beach resort town perfect for relaxation and water activities',
        bestFor: ['beach', 'relaxation', 'food', 'shopping'],
        location: { latitude: 36.3845, longitude: 10.6146 },
        travelTime: { fromTunis: '1 hour' },
        attractions: ['Medina', 'Kasbah', 'Beaches', 'Marina'],
        budgetLevels: ['Budget', 'Moderate', 'Premium', 'Luxury'],
        accommodationTypes: ['hotel', 'resort', 'airbnb', 'guesthouse'],
        crowdLevel: 'moderate',
        activityLevel: 'relaxed',
        familyFriendly: true,
        highlights: ['Sandy beaches', 'Historic medina', 'Modern resort area'],
        estimatedCost: { minBudget: 40, maxBudget: 150 },
      },
      {
        name: 'Djerba',
        region: 'coast',
        description: 'Island paradise with pristine beaches, rich culture, and unique architecture',
        bestFor: ['beach', 'food', 'relaxation', 'cultureHistory'],
        location: { latitude: 33.8067, longitude: 10.9575 },
        travelTime: { fromTunis: '4 hours' },
        attractions: ['Houmt Souk', 'Gellala Museum', 'Beaches', 'Ghriba Synagogue'],
        budgetLevels: ['Budget', 'Moderate', 'Premium', 'Luxury'],
        accommodationTypes: ['hotel', 'resort', 'airbnb', 'guesthouse'],
        crowdLevel: 'moderate',
        activityLevel: 'relaxed',
        familyFriendly: true,
        highlights: ['Island beaches', 'Unique white buildings', 'Fresh seafood'],
        estimatedCost: { minBudget: 45, maxBudget: 160 },
      },
      {
        name: 'Tunis Medina',
        region: 'historical_cities',
        description: 'UNESCO heritage site with historic souks, palaces, and traditional Tunisian architecture',
        bestFor: ['cultureHistory', 'shopping', 'food'],
        location: { latitude: 36.7969, longitude: 10.1648 },
        travelTime: { fromTunis: '0 hours' },
        attractions: ['Souks', 'Bardo Museum', 'Ez-Zitouna Mosque', 'Dar Ben Abdallah'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: ['guesthouse', 'hotel', 'airbnb'],
        crowdLevel: 'touristy',
        activityLevel: 'moderate',
        familyFriendly: true,
        highlights: ['Historic medina', 'Traditional crafts', 'Authentic food'],
        estimatedCost: { minBudget: 30, maxBudget: 80 },
      },
      {
        name: 'Carthage',
        region: 'historical_cities',
        description: 'Ancient Roman ruins and historical sites with Mediterranean views',
        bestFor: ['cultureHistory', 'nature'],
        location: { latitude: 36.8621, longitude: 10.3259 },
        travelTime: { fromTunis: '1 hour' },
        attractions: ['Roman Villas', 'Theatre', 'Museums', 'Beaches'],
        budgetLevels: ['Budget', 'Moderate', 'Premium'],
        accommodationTypes: ['hotel', 'airbnb', 'guesthouse'],
        crowdLevel: 'moderate',
        activityLevel: 'moderate',
        familyFriendly: true,
        highlights: ['Ancient ruins', 'Historical significance', 'Coastal views'],
        estimatedCost: { minBudget: 40, maxBudget: 120 },
      },
      {
        name: 'Kairouan',
        region: 'historical_cities',
        description: 'Ancient Islamic holy city with stunning mosques, medina, and religious significance',
        bestFor: ['cultureHistory', 'food'],
        location: { latitude: 35.6781, longitude: 10.0963 },
        travelTime: { fromTunis: '2 hours' },
        attractions: ['Great Mosque', 'Medina', 'Mosque of the Barber', 'Souks'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: ['guesthouse', 'hotel'],
        crowdLevel: 'quiet',
        activityLevel: 'moderate',
        familyFriendly: true,
        highlights: ['Religious heritage', 'Traditional medina', 'Carpet workshops'],
        estimatedCost: { minBudget: 25, maxBudget: 60 },
      },
      {
        name: 'El Jem',
        region: 'historical_cities',
        description: 'UNESCO site with the impressive Roman amphitheatre, one of the largest in Africa',
        bestFor: ['cultureHistory'],
        location: { latitude: 35.2394, longitude: 10.7333 },
        travelTime: { fromTunis: '3 hours' },
        attractions: ['Roman Amphitheatre', 'Museum', 'Archaeological sites'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: ['guesthouse', 'hotel'],
        crowdLevel: 'quiet',
        activityLevel: 'moderate',
        familyFriendly: true,
        highlights: ['Ancient monument', 'Archaeological importance', 'Small town charm'],
        estimatedCost: { minBudget: 20, maxBudget: 50 },
      },
      {
        name: 'Tozeur',
        region: 'desert',
        description: 'Desert oasis town with palm groves, stunning dunes, and gateway to the Sahara',
        bestFor: ['desertAdventure', 'nature', 'adventure'],
        location: { latitude: 33.9211, longitude: 8.1385 },
        travelTime: { fromTunis: '5 hours' },
        attractions: ['Chebika', 'Tamerza', 'Star Wars sets', 'Dune activities'],
        budgetLevels: ['Budget', 'Moderate', 'Premium'],
        accommodationTypes: ['hotel', 'resort', 'guesthouse'],
        crowdLevel: 'moderate',
        activityLevel: 'adventurous',
        familyFriendly: true,
        highlights: ['Desert oasis', 'Sahara experiences', 'Sunset views'],
        estimatedCost: { minBudget: 50, maxBudget: 140 },
      },
      {
        name: 'Douz',
        region: 'desert',
        description: 'Sahara desert town famous for camel trekking, nomadic culture, and sand dunes',
        bestFor: ['desertAdventure', 'adventure', 'food'],
        location: { latitude: 33.4652, longitude: 9.0299 },
        travelTime: { fromTunis: '6 hours' },
        attractions: ['Camel trekking', 'Dune markets', 'Nomadic villages', 'Sand dunes'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: ['hotel', 'guesthouse', 'camping'],
        crowdLevel: 'quiet',
        activityLevel: 'adventurous',
        familyFriendly: true,
        highlights: ['Authentic Sahara', 'Camel experiences', 'Bedouin culture'],
        estimatedCost: { minBudget: 30, maxBudget: 100 },
      },
      {
        name: 'Sousse',
        region: 'coast',
        description: 'Coastal city with beaches, medina, and vibrant nightlife and restaurants',
        bestFor: ['beach', 'nightlife', 'food', 'relaxation'],
        location: { latitude: 35.8256, longitude: 10.6369 },
        travelTime: { fromTunis: '2 hours' },
        attractions: ['Medina', 'Ribat', 'Beaches', 'Port', 'Restaurants'],
        budgetLevels: ['Budget', 'Moderate', 'Premium'],
        accommodationTypes: ['hotel', 'resort', 'airbnb'],
        crowdLevel: 'touristy',
        activityLevel: 'moderate',
        familyFriendly: true,
        highlights: ['Lively atmosphere', 'Beach access', 'Great restaurants'],
        estimatedCost: { minBudget: 40, maxBudget: 130 },
      },
      {
        name: 'Mahdia',
        region: 'coast',
        description: 'Charming fishing village with beautiful beaches and authentic Tunisian atmosphere',
        bestFor: ['beach', 'food', 'relaxation'],
        location: { latitude: 35.5047, longitude: 11.0631 },
        travelTime: { fromTunis: '3 hours' },
        attractions: ['Beaches', 'Medina', 'Fort', 'Fish market'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: ['guesthouse', 'hotel', 'airbnb'],
        crowdLevel: 'quiet',
        activityLevel: 'relaxed',
        familyFriendly: true,
        highlights: ['Authentic fishing village', 'Quiet beaches', 'Fresh seafood'],
        estimatedCost: { minBudget: 30, maxBudget: 80 },
      },
      {
        name: 'Tataouine',
        region: 'desert',
        description: 'Remote desert town with unique culture, Berber heritage, and Star Wars filming locations',
        bestFor: ['desertAdventure', 'cultureHistory', 'adventure'],
        location: { latitude: 32.9307, longitude: 10.4518 },
        travelTime: { fromTunis: '7 hours' },
        attractions: ['Star Wars sets', 'Ksar towns', 'Berber villages', 'Markets'],
        budgetLevels: ['Budget'],
        accommodationTypes: ['guesthouse', 'camping'],
        crowdLevel: 'quiet',
        activityLevel: 'adventurous',
        familyFriendly: false,
        highlights: ['Off-the-beaten path', 'Authentic culture', 'Unique architecture'],
        estimatedCost: { minBudget: 25, maxBudget: 70 },
      },
      {
        name: 'Zaghouan',
        region: 'north',
        description: 'Mountain town with natural springs, hiking trails, and fresh alpine air',
        bestFor: ['nature', 'adventure', 'hiking'],
        location: { latitude: 36.4, longitude: 10.1433 },
        travelTime: { fromTunis: '1.5 hours' },
        attractions: ['Water Springs', 'Mountain trails', 'Temple of Waters', 'Hiking'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: ['guesthouse', 'hotel'],
        crowdLevel: 'quiet',
        activityLevel: 'adventurous',
        familyFriendly: true,
        highlights: ['Mountain scenery', 'Hiking opportunities', 'Refreshing springs'],
        estimatedCost: { minBudget: 25, maxBudget: 70 },
      },
      {
        name: 'Monastir',
        region: 'coast',
        description: 'Beach resort with historic ribat fortress and modern tourism infrastructure',
        bestFor: ['beach', 'relaxation', 'cultureHistory'],
        location: { latitude: 35.7718, longitude: 10.8307 },
        travelTime: { fromTunis: '2.5 hours' },
        attractions: ['Ribat Fortress', 'Beaches', 'Marina', 'Archaeological Museum'],
        budgetLevels: ['Budget', 'Moderate', 'Premium'],
        accommodationTypes: ['hotel', 'resort', 'airbnb'],
        crowdLevel: 'moderate',
        activityLevel: 'relaxed',
        familyFriendly: true,
        highlights: ['Beach and history', 'Modern amenities', 'Fortress views'],
        estimatedCost: { minBudget: 40, maxBudget: 130 },
      },
    ];

    const result = await Destination.insertMany(destinationsData);

    return Response.json({
      message: 'Destinations seeded successfully',
      count: result.length,
    }, { status: 201 });
  } catch (error) {
    return Response.json({
      error: error.message,
    }, { status: 500 });
  }
}
