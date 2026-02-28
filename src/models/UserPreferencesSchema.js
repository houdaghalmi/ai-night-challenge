import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    
    // Step 1: Travel Preferences
    travelPreferences: {
      travelerType: {
        type: String,
        enum: ['solo', 'couple', 'family', 'friends'],
        required: true,
      },
      budgetRange: {
        type: String,
        enum: ['low', 'medium', 'high', 'luxury'],
        required: true,
      },
      travelDuration: {
        type: Number, // Number of days
        required: true,
        min: 1,
        max: 365,
      },
      travelDates: {
        startDate: Date,
        endDate: Date,
        flexible: {
          type: Boolean,
          default: true,
        },
      },
      preferredRegions: {
        type: [String],
        validate: {
          validator: (v) => {
            const validRegions = ['north', 'south', 'coast', 'desert', 'historical_cities'];
            return v && v.length > 0 && v.every(region => validRegions.includes(region));
          },
          message: 'Invalid region selection or at least one region must be selected',
        },
      },
    },
    
    // Step 2: Interest Categories
    interests: {
      beach: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      cultureHistory: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      desertAdventure: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      foodGastronomy: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      nightlife: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      natureMountains: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      shopping: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      relaxationSpa: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },
    
    // Step 3: Travel Style & Logistics
    travelStyle: {
      accommodationType: {
        type: [String],
        validate: {
          validator: (v) => {
            const validTypes = ['hotel', 'airbnb', 'guesthouse', 'resort', 'hostel', 'camping'];
            return v && v.length > 0 && v.every(type => validTypes.includes(type));
          },
          message: 'Invalid accommodation type or at least one type must be selected',
        },
      },
      transportationPreference: {
        type: [String],
        validate: {
          validator: (v) => {
            const validTransport = ['rental_car', 'public_transport', 'private_driver', 'organized_tours', 'taxi', 'walking_cycling'];
            return v && v.length > 0 && v.every(transport => validTransport.includes(transport));
          },
          message: 'Invalid transportation preference or at least one option must be selected',
        },
      },
      crowdTolerance: {
        type: String,
        enum: ['avoid_crowds', 'neutral', 'popular_spots'],
        required: true,
      },
      activityIntensity: {
        type: String,
        enum: ['relaxed', 'moderate', 'adventurous'],
        required: true,
      },
    },
    
    // Additional metadata
    completedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userPreferencesSchema.index({ userId: 1 });

export default mongoose.models.UserPreferences || 
  mongoose.model('UserPreferences', userPreferencesSchema);
