import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Team from '../../../models/Team';
import Event from '../../../models/Event';
import User from '../../../models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import mongoose from 'mongoose';

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
    const eventId = searchParams.get('eventId') || '';

    // Connect to the database
    await connectToDatabase();

    // Build query
    let query: any = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { fullname: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (eventId && eventId !== 'all') {
      query.event = eventId;
    }

    // Count total documents for pagination
    const total = await Team.countDocuments(query);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Fetch teams with pagination
    const teams = await Team.find(query)
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limit);

    // Get all unique event IDs from teams
    const eventIds = [...new Set(teams.map(team => team.event?.toString()).filter(Boolean))];
    
    // Fetch events from MongoDB
    const dbEvents = await Event.find({ _id: { $in: eventIds } });
    
    // Create a map of event IDs to event objects
    const eventMap = new Map();
    dbEvents.forEach(event => {
      eventMap.set(event._id.toString(), {
        _id: event._id.toString(),
        title: event.title
      });
    });

    // Get all unique leader IDs from teams
    const leaderIds = [...new Set(teams.map(team => team.leader?.toString()).filter(Boolean))];
    
    // Fetch users from MongoDB that match leader IDs
    const users = await User.find({ _id: { $in: leaderIds.map(id => new mongoose.Types.ObjectId(id)) } });
    
    // Create a map of user IDs to user objects
    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
    });

    // Format the response
    const formattedTeams = teams.map(team => {
      const eventId = team.event?.toString();
      const eventInfo = eventId ? eventMap.get(eventId) : null;
      
      // Get user information for the team leader
      const leaderId = team.leader?.toString();
      const leaderInfo = leaderId ? userMap.get(leaderId) : null;
      
      return {
        _id: team._id.toString(),
        name: team.name,
        event: eventInfo || (eventId ? { _id: eventId, title: "Event information not available" } : null),
        // Include both team fields and leader details
        phone: team.phone || '',
        email: team.email || '',
        fullname: team.fullname || '',
        institution: team.institution || '',
        // Check various possible member field names in case MongoDB has different casing/naming
        member1: team.member1 || team.Member1 || team.member_1 || '',
        member2: team.member2 || team.Member2 || team.member_2 || '',
        member3: team.member3 || team.Member3 || team.member_3 || '',
        leader: leaderInfo ? {
          _id: leaderInfo._id,
          name: leaderInfo.name,
          email: leaderInfo.email,
          phone: leaderInfo.phone,
          role: leaderInfo.role
        } : null,
        members: team.members,
        registrationDate: team.registrationDate.toISOString()
      };
    });

    return NextResponse.json({
      teams: formattedTeams,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    console.error('Error in teams API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
} 