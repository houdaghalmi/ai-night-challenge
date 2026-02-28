import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import UserPreferencesSchema from '@/models/UserPreferencesSchema';
import UserSchema from '@/models/UserSchema';
import mongoose from 'mongoose';

// GET - Retrieve user preferences
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Convert string ID to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);
    
    const preferences = await UserPreferencesSchema.findOne({ 
      userId 
    });
    
    if (!preferences) {
      return NextResponse.json(
        { message: 'No preferences found', preferences: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ preferences }, { status: 200 });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve preferences' },
      { status: 500 }
    );
  }
}

// POST - Save or update user preferences
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'travelPreferences',
      'interests',
      'travelStyle'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    await dbConnect();
    
    // Convert string ID to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);
    
    // Check if preferences already exist
    let preferences = await UserPreferencesSchema.findOne({ 
      userId 
    });
    
    if (preferences) {
      // Update existing preferences
      preferences.travelPreferences = body.travelPreferences;
      preferences.interests = body.interests;
      preferences.travelStyle = body.travelStyle;
      preferences.completedAt = new Date();
      preferences.version += 1;
      
      await preferences.save();
    } else {
      // Create new preferences
      preferences = new UserPreferencesSchema({
        userId,
        travelPreferences: body.travelPreferences,
        interests: body.interests,
        travelStyle: body.travelStyle,
      });
      
      await preferences.save();
    }

    // Update user's onboarding status
    await UserSchema.findByIdAndUpdate(
      userId,
      { onboardingCompleted: true },
      { new: true }
    );

    return NextResponse.json(
      { 
        message: 'Preferences saved successfully',
        preferences 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Save preferences error:', error);
    console.error('Error details:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to save preferences',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update specific preference sections
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    await dbConnect();
    
    // Convert string ID to ObjectId
    const userId = new mongoose.Types.ObjectId(session.user.id);
    
    const preferences = await UserPreferencesSchema.findOne({ 
      userId 
    });
    
    if (!preferences) {
      return NextResponse.json(
        { error: 'Preferences not found' },
        { status: 404 }
      );
    }

    // Update only provided fields
    if (body.travelPreferences) {
      preferences.travelPreferences = {
        ...preferences.travelPreferences,
        ...body.travelPreferences
      };
    }
    
    if (body.interests) {
      preferences.interests = {
        ...preferences.interests,
        ...body.interests
      };
    }
    
    if (body.travelStyle) {
      preferences.travelStyle = {
        ...preferences.travelStyle,
        ...body.travelStyle
      };
    }
    
    preferences.version += 1;
    await preferences.save();

    return NextResponse.json(
      { 
        message: 'Preferences updated successfully',
        preferences 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
