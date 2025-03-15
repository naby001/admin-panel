// Script to seed users from team leader information
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

console.log('MongoDB URI found, connecting to database...');

async function seedUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const database = client.db();
    const teamsCollection = database.collection('teams');
    const usersCollection = database.collection('users');
    
    // Check if users already exist
    const existingCount = await usersCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} users already exist in the database.`);
      const shouldContinue = await promptUser('Do you want to delete existing users and reseed? (y/n): ');
      if (shouldContinue.toLowerCase() !== 'y') {
        console.log('Seeding cancelled.');
        return;
      }
      
      // Delete existing users
      await usersCollection.deleteMany({});
      console.log('Existing users deleted.');
    }
    
    // Get all teams to extract leader information
    const teams = await teamsCollection.find({}).toArray();
    console.log(`Found ${teams.length} teams to extract leader information.`);
    
    // Extract unique leaders based on email
    const leaderMap = new Map();
    teams.forEach(team => {
      if (team.leader && team.leader.email) {
        leaderMap.set(team.leader.email, {
          name: team.leader.name,
          email: team.leader.email,
          phone: team.leader.phone || '',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
    
    // Convert to array
    const users = Array.from(leaderMap.values());
    
    if (users.length === 0) {
      console.log('No users found to seed.');
      return;
    }
    
    // Insert users into MongoDB
    const result = await usersCollection.insertMany(users);
    console.log(`${result.insertedCount} users successfully seeded to MongoDB Atlas.`);
    
  } catch (error) {
    console.error('Error seeding users:', error);
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
seedUsers().catch(console.error); 