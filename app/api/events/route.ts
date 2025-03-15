import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authOptions';
import connectToDatabase from '../../../lib/mongodb';
import Event from '../../../models/Event';

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Connect to MongoDB Atlas
    await connectToDatabase();
    
    // Build query
    let query: any = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { venue: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Count total documents for pagination
    const total = await Event.countDocuments(query);
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch events from MongoDB
    const mongoEvents = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);
    
    // Format events from MongoDB
    const eventsData = mongoEvents.map(event => ({
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      venue: event.venue,
      maxTeamSize: event.maxTeamSize,
      minTeamSize: event.minTeamSize,
      registrationDeadline: event.registrationDeadline.toISOString(),
      createdAt: event.createdAt.toISOString(),
      type: event.type
    }));
    
    // Calculate pages
    const pages = Math.ceil(total / limit);
    
    return NextResponse.json({
      events: eventsData,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 