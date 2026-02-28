import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';

export async function POST(request) {
  try {
    await dbConnect();
    
    // Check if destinations already exist
    const existingCount = await Destination.countDocuments();
    
    if (existingCount > 0) {
      return Response.json({
        message: 'Destinations already seeded',
        count: existingCount,
        nextStep: 'Complete onboarding and view recommendations'
      });
    }

    // Seed destinations
    const destinationsData = [
      {
        name: 'Dar El Jeld Restaurant',
        region: 'historical_cities',
        description: 'Traditional Tunisian restaurant in a restored palace with authentic cuisine',
        bestFor: ['food', 'cultureHistory'],
        location: { latitude: 36.7969, longitude: 10.1648 },
        travelTime: { fromTunis: '0 hours' },
        attractions: ['Traditional Tunisian cuisine', 'Historic building', 'Live music'],
        budgetLevels: ['Premium'],
        accommodationTypes: [],
        crowdLevel: 'moderate',
        activityLevel: 'relaxed',
        familyFriendly: true,
        highlights: ['Authentic couscous', 'Palace atmosphere', 'Traditional decor'],
        estimatedCost: { minBudget: 40, maxBudget: 80 },
        placeType: 'restaurant',
      },
      {
        name: 'Hammamet Beach',
        region: 'coast',
        description: 'Popular sandy beach with clear waters and water sports facilities',
        bestFor: ['beach', 'adventure'],
        location: { latitude: 36.3845, longitude: 10.6146 },
        travelTime: { fromTunis: '1 hour' },
        attractions: ['Swimming', 'Jet skiing', 'Parasailing', 'Beach clubs'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: [],
        crowdLevel: 'touristy',
        activityLevel: 'moderate',
        familyFriendly: true,
        highlights: ['Clean beach', 'Water activities', 'Beach restaurants'],
        estimatedCost: { minBudget: 0, maxBudget: 30 },
        placeType: 'beach',
      },
      {
        name: 'Four Seasons Resort Gammarth',
        region: 'coast',
        description: 'Luxury beachfront resort with spa, pools, and world-class amenities',
        bestFor: ['beach', 'relaxation', 'spa'],
        location: { latitude: 36.9078, longitude: 10.3156 },
        travelTime: { fromTunis: '0.5 hours' },
        attractions: ['Private beach', 'Spa', 'Multiple restaurants', 'Golf course'],
        budgetLevels: ['Luxury'],
        accommodationTypes: ['resort', 'hotel'],
        crowdLevel: 'quiet',
        activityLevel: 'relaxed',
        familyFriendly: true,
        highlights: ['5-star luxury', 'Private beach', 'World-class spa'],
        estimatedCost: { minBudget: 250, maxBudget: 600 },
        placeType: 'lodging',
      },
      {
        name: 'Bardo National Museum',
        region: 'historical_cities',
        description: 'World-famous museum with the largest collection of Roman mosaics',
        bestFor: ['cultureHistory'],
        location: { latitude: 36.8089, longitude: 10.1350 },
        travelTime: { fromTunis: '0 hours' },
        attractions: ['Roman mosaics', 'Ancient artifacts', 'Archaeological exhibits'],
        budgetLevels: ['Budget'],
        accommodationTypes: [],
        crowdLevel: 'moderate',
        activityLevel: 'moderate',
        familyFriendly: true,
        highlights: ['World heritage', 'Mosaic collection', 'Historic palace'],
        estimatedCost: { minBudget: 5, maxBudget: 10 },
        placeType: 'tourist_attraction',
      },
      {
        name: 'Sahara Desert Tours Douz',
        region: 'desert',
        description: 'Gateway to the Sahara offering camel treks and desert camping',
        bestFor: ['desertAdventure', 'adventure'],
        location: { latitude: 33.4652, longitude: 9.0299 },
        travelTime: { fromTunis: '6 hours' },
        attractions: ['Camel trekking', 'Desert camping', '4x4 tours', 'Bedouin culture'],
        budgetLevels: ['Budget', 'Moderate'],
        accommodationTypes: ['camping'],
        crowdLevel: 'quiet',
        activityLevel: 'adventurous',
        familyFriendly: true,
        highlights: ['Authentic Sahara', 'Sunset dunes', 'Star gazing'],
        estimatedCost: { minBudget: 40, maxBudget: 120 },
        placeType: 'tourist_attraction',
      },
    ];

    const result = await Destination.insertMany(destinationsData);
    
    return Response.json({
      message: 'Quick start destinations seeded successfully',
      count: result.length,
      nextStep: 'Complete onboarding at /onboarding to get personalized recommendations'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json(
      { error: error.message || 'Failed to seed destinations' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const count = await Destination.countDocuments();
    const destinations = await Destination.find().limit(3);
    
    return Response.json({
      destinationCount: count,
      sampleDestinations: destinations,
      status: count > 0 ? 'Ready to use' : 'Need to seed database',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
