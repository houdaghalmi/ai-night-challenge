import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  region: {
    type: String,
    enum: ['north', 'south', 'coast', 'desert', 'historical_cities'],
    required: true,
  },
  description: String,
  bestFor: [String], // e.g., ['beach', 'cultureHistory', 'desertAdventure', 'food', 'shopping', 'relaxation']
  location: {
    latitude: Number,
    longitude: Number,
  },
  travelTime: {
    fromTunis: String, // e.g., "2 hours"
  },
  attractions: [String],
  
  // Budget compatibility (low, medium, high, luxury)
  budgetLevels: [String],
  
  // Accommodation types available
  accommodationTypes: [String],
  
  // Travel style compatibility
  crowdLevel: String, // 'quiet', 'moderate', 'touristy'
  activityLevel: String, // 'relaxed', 'moderate', 'adventurous'
  
  // Best season
  bestMonths: [Number], // 1-12
  
  // Family friendly
  familyFriendly: Boolean,
  
  // Highlight features
  highlights: [String],
  
  // Estimated costs (in USD per day)
  estimatedCost: {
    minBudget: Number,
    maxBudget: Number,
  },
  
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
