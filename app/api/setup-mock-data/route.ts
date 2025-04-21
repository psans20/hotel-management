import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Customer from '@/app/models/Customer';

// Mock data
const mockCustomers = [
  {
    customerRef: 'CUST001',
    customerName: 'John Doe',
    gender: 'Male',
    mobile: '1234567890',
    email: 'john@example.com',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    zipCode: '10001'
  },
  {
    customerRef: 'CUST002',
    customerName: 'Jane Smith',
    gender: 'Female',
    mobile: '0987654321',
    email: 'jane@example.com',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    zipCode: '90001'
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear existing customers
    await Customer.deleteMany({});
    
    // Insert mock customers
    const customers = await Customer.insertMany(mockCustomers);
    
    return NextResponse.json({ 
      message: 'Mock data setup successful',
      customers 
    });
  } catch (error) {
    console.error('Error setting up mock data:', error);
    return NextResponse.json({ 
      error: 'Failed to setup mock data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 