// Script to seed events from eventData.js to MongoDB Atlas
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Import events data from JS file
const { events } = require('../data/eventData.js');

// MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

console.log('MongoDB URI found, connecting to database...');

async function seedEvents() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const database = client.db();
    const eventsCollection = database.collection('events');
    
    // Check if events already exist
    const existingCount = await eventsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} events already exist in the database.`);
      const shouldContinue = await promptUser('Do you want to delete existing events and reseed? (y/n): ');
      if (shouldContinue.toLowerCase() !== 'y') {
        console.log('Seeding cancelled.');
        return;
      }
      
      // Delete existing events
      await eventsCollection.deleteMany({});
      console.log('Existing events deleted.');
    }
    
    // Format events for MongoDB
    const formattedEvents = events.map(event => {
      // Parse dates
      let eventDate;
      try {
        if (event.finalsDate && event.finalsDate.includes('-')) {
          const [day, month, year] = event.finalsDate.split('-');
          eventDate = new Date(`${year}-${month}-${day}`);
          if (isNaN(eventDate.getTime())) {
            eventDate = new Date();
          }
        } else {
          eventDate = new Date();
        }
      } catch (error) {
        console.error(`Error parsing date for event ${event.title}:`, error);
        eventDate = new Date();
      }
      
      // Parse registration deadline
      let registrationDeadline;
      try {
        if (event.prelimsDate && event.prelimsDate.includes('-')) {
          // Handle formats like "17-03-2025 (online mode)" by taking only the date part
          const datePart = event.prelimsDate.split(' ')[0];
          const [day, month, year] = datePart.split('-');
          registrationDeadline = new Date(`${year}-${month}-${day}`);
          if (isNaN(registrationDeadline.getTime())) {
            registrationDeadline = eventDate;
          }
        } else {
          registrationDeadline = eventDate;
        }
      } catch (error) {
        console.error(`Error parsing registration deadline for event ${event.title}:`, error);
        registrationDeadline = eventDate;
      }
      
      // Parse group size to get min and max
      let minTeamSize = 1;
      let maxTeamSize = 1;
      
      if (event.groupSize) {
        if (event.groupSize.includes('-')) {
          const [min, max] = event.groupSize.split('-').map(num => parseInt(num.trim()));
          minTeamSize = min || 1;
          maxTeamSize = max || minTeamSize;
        } else {
          const size = parseInt(event.groupSize);
          if (!isNaN(size)) {
            minTeamSize = maxTeamSize = size;
          }
        }
      }
      
      return {
        _id: new ObjectId(event.id),
        title: event.title,
        description: event.description,
        date: eventDate,
        venue: event.location,
        maxTeamSize,
        minTeamSize,
        registrationDeadline,
        type: event.type,
        price: event.price || 0,
        image: event.image || null,
        coordinators: event.coordinators || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    
    // Insert events into MongoDB
    const result = await eventsCollection.insertMany(formattedEvents);
    console.log(`${result.insertedCount} events successfully seeded to MongoDB Atlas.`);
    console.log('Events collection created with the same IDs as in eventData.ts');
    
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

// Helper function to prompt user
function promptUser(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run the seed function
seedEvents().catch(console.error); 