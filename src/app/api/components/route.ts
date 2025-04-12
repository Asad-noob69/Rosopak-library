import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, generateId } from '@/lib/mongodb';

// Admin password (in production, store this in environment variables)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rosopak123';

// GET - List components by type
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    console.log(`Fetching components of type: ${type || 'all'}`);

    // Connect to MongoDB Atlas - this will throw an error if connection fails
    const { db } = await connectToDatabase();
    
    // Get components collection
    const componentsCollection = db.collection('components');
    
    // Query conditions
    const query = type ? { type } : {};
    
    // Get all components
    const components = await componentsCollection.find(query).toArray();
    console.log(`Found ${components.length} components of type: ${type || 'all'}`);
    
    // Return components
    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch components from MongoDB Atlas. Please check your connection string and ensure your IP is allowed in the Atlas network settings.' },
      { status: 500 }
    );
  }
}

// POST - Create a new component
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, code, type, password } = body;
    
    // Validate required fields
    if (!name || !code || !type) {
      return NextResponse.json(
        { error: 'Name, code, and type are required' },
        { status: 400 }
      );
    }
    
    // Validate component type
    if (type !== 'backend' && type !== 'frontend') {
      return NextResponse.json(
        { error: 'Type must be either "backend" or "frontend"' },
        { status: 400 }
      );
    }
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Generate a unique ID
    const id = generateId();
    
    // Create component object
    const component = {
      id,
      name,
      code,
      type,
      createdAt: new Date()
    };
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Get components collection
    const componentsCollection = db.collection('components');
    
    // Insert component
    await componentsCollection.insertOne(component);
    
    // Return created component
    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json(
      { error: 'Failed to create component in MongoDB Atlas. Please check your connection string and ensure your IP is allowed in the Atlas network settings.' },
      { status: 500 }
    );
  }
}