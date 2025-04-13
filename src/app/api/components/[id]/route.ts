import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Admin password (in production, store this in environment variables)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rosopak123';

// Type for the params object
type Params = {
  id: string;
};

// GET - Retrieve component by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Params } // Directly destructure and type the 'params' object
) {
  try {
    const { id } = params;
    console.log(`Fetching component with ID: ${id}`);

    // Connect to MongoDB Atlas
    const { db } = await connectToDatabase();

    // Get components collection
    const componentsCollection = db.collection('components');

    // Find the component by ID
    const component = await componentsCollection.findOne({ id });

    // Check if component exists
    if (!component) {
      console.log(`Component with ID: ${id} not found`);
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    console.log(`Successfully retrieved component: ${component.name}`);
    // Return component
    return NextResponse.json(component);
  } catch (error: any) { // It's good practice to type the error
    console.error(`Error fetching component with ID ${params?.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB Atlas. Please check your connection string and ensure your IP is allowed in the Atlas network settings.' },
      { status: 500 }
    );
  }
}

// PUT - Update component by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Params } // Ensure consistent context destructuring
) {
  try {
    const { id } = params;
    console.log(`Updating component with ID: ${id}`);

    // Parse request body
    const body = await request.json();
    const { name, code, type, password } = body;

    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Connect to MongoDB Atlas
    const { db } = await connectToDatabase();

    // Get components collection
    const componentsCollection = db.collection('components');

    // Check if component exists
    const existingComponent = await componentsCollection.findOne({ id });
    if (!existingComponent) {
      console.log(`Component with ID: ${id} not found for update`);
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    // Update data
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (code) updateData.code = code;
    if (type) updateData.type = type;

    // Update component
    await componentsCollection.updateOne(
      { id },
      { $set: updateData }
    );

    // Get updated component
    const updatedComponent = await componentsCollection.findOne({ id });

    console.log(`Successfully updated component: ${updatedComponent?.name}`);
    // Return updated component
    return NextResponse.json(updatedComponent);
  } catch (error: any) {
    console.error(`Error updating component with ID ${params?.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB Atlas. Please check your connection string and ensure your IP is allowed in the Atlas network settings.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete component by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params } // Ensure consistent context destructuring
) {
  try {
    const { id } = await params;
    console.log(`Deleting component with ID: ${id}`);

    // Parse request body for password
    const body = await request.json();
    const { password } = body;

    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Connect to MongoDB Atlas
    const { db } = await connectToDatabase();

    // Get components collection
    const componentsCollection = db.collection('components');

    // Check if component exists
    const existingComponent = await componentsCollection.findOne({ id });
    if (!existingComponent) {
      console.log(`Component with ID: ${id} not found for deletion`);
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    // Delete component
    await componentsCollection.deleteOne({ id });

    console.log(`Successfully deleted component: ${existingComponent.name}`);
    // Return success message
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error deleting component with ID ${params?.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB Atlas. Please check your connection string and ensure your IP is allowed in the Atlas network settings.' },
      { status: 500 }
    );
  }
}