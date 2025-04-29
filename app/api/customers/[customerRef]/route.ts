import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Customer from '@/app/models/Customer';

type RouteContext = {
  params: {
    customerRef: string;
  };
};

// GET endpoint to fetch a specific customer by customerRef
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { customerRef } = params;
    
    await connectToDatabase();
    const customer = await Customer.findOne({ customerRef });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a customer by customerRef
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { customerRef } = params;
    console.log('DELETE request received for customerRef:', customerRef);
    
    // Connect to the database
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('Connected to MongoDB successfully');
    
    // Find the customer first to confirm it exists
    console.log('Checking if customer exists with ref:', customerRef);
    const existingCustomer = await Customer.findOne({ customerRef });
    
    if (!existingCustomer) {
      console.log('No customer found with reference:', customerRef);
      return NextResponse.json(
        { error: 'No customer found with this reference' },
        { status: 404 }
      );
    }
    
    console.log('Customer found, proceeding with deletion:', existingCustomer);
    
    // Delete the customer
    console.log('Attempting to delete customer with ref:', customerRef);
    const deletedCustomer = await Customer.findOneAndDelete({ customerRef });
    
    console.log('Customer deleted successfully:', deletedCustomer);
    return NextResponse.json({ 
      message: 'Customer deleted successfully',
      customer: deletedCustomer
    });
  } catch (error) {
    console.error('Database error during delete:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 