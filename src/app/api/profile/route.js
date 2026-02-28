import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserSchema from '@/models/UserSchema';

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    const { name, phone } = await req.json();

    // Update user in database
    const updatedUser = await UserSchema.findByIdAndUpdate(
      session.user.id,
      { name, phone },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Profile updated', user: updatedUser }), { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update profile' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    const user = await UserSchema.findById(session.user.id);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), { status: 500 });
  }
}
