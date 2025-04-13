// MongoDB connection utility
import { MongoClient, Db } from 'mongodb';

// Connection URI - use MongoDB Atlas URI from environment variable
// Never use localhost as it won't work without MongoDB running locally
const uri = process.env.MONGODB_URI;

// Database Name
const dbName = process.env.MONGODB_DB;

// Cache client promise to prevent multiple connections during development
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // Validate MongoDB URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined. Please add your MongoDB Atlas connection string to your .env.local file.');
  }

  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    console.log('Connected to MongoDB Atlas successfully.');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Unable to connect to MongoDB Atlas. Please check your connection string and network.');
  }
}

// Helper function to generate a unique ID
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}