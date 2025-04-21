import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Customer from '../../../models/Customer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const value = searchParams.get('value');

    if (!field || !value) {
      return NextResponse.json(
        { error: 'Field and value parameters are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Create a case-insensitive regex search
    const query = {
      [field]: { $regex: value, $options: 'i' }
    };
    
    console.log('Searching with query:', query);
    
    const customers = await Customer.find(query);
    console.log(`Found ${customers.length} customers matching the criteria`);
    
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to filter customers', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 