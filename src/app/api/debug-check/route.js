import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';
import UserSchema from '@/models/UserSchema';

export async function GET(request) {
  try {
    await dbConnect();

    const destCount = await Destination.countDocuments();
    const userCount = await UserSchema.countDocuments();
    
    const destinations = await Destination.find().limit(2);
    const users = await UserSchema.find().limit(1);

    return Response.json({
      destinationCount: destCount,
      userCount: userCount,
      destinations: destinations,
      users: users,
      message: `Database has ${destCount} destinations and ${userCount} users`
    });
  } catch (error) {
    console.error('Debug error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
