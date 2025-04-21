import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Customer from '@/app/models/Customer';
import Booking from '@/app/models/Booking';

// GET endpoint to fetch all customers
export async function GET() {
  try {
    await connectToDatabase();
    const customerList = await Customer.find({}).sort({ customerRef: 1 });
    return NextResponse.json(customerList);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch customers',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST endpoint to add a new customer
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['customerName', 'gender', 'mobile', 'email'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    // Check if customerRef already exists
    if (data.customerRef) {
      const existingCustomer = await Customer.findOne({ customerRef: data.customerRef });
      if (existingCustomer) {
        return NextResponse.json({ 
          error: 'Customer reference already exists' 
        }, { status: 409 });
      }
    }
    
    const customer = new Customer(data);
    await customer.save();
    
    // Create corresponding booking entry
    const newBooking = new Booking({
      bookingRef: `BOOK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerRef: customer.mobile,
      roomNumber: '',
      checkInDate: null,
      checkOutDate: null,
      numberOfGuests: 1,
      roomType: 'Single',
      meal: 'Breakfast',
      noOfDays: 0,
      paidTax: 0,
      actualTotal: 0,
      totalCost: 0,
      totalAmount: 0,
      status: 'Pending'
    });
    
    await newBooking.save();
    
    return NextResponse.json({ 
      message: 'Customer and booking entry created successfully',
      customer 
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ 
      error: 'Failed to create customer',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT endpoint to update a customer
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { customerRef, ...updateData } = data;

    if (!customerRef) {
      return NextResponse.json({ 
        error: 'Customer reference is required' 
      }, { status: 400 });
    }

    // Get the old customer data to check if mobile number changed
    const oldCustomer = await Customer.findOne({ customerRef });
    if (!oldCustomer) {
      return NextResponse.json({ 
        error: 'Customer not found' 
      }, { status: 404 });
    }

    // Update the customer
    const customer = await Customer.findOneAndUpdate(
      { customerRef },
      updateData,
      { new: true, runValidators: true }
    );

    // If mobile number changed, update the booking reference
    if (oldCustomer.mobile !== customer.mobile) {
      await Booking.findOneAndUpdate(
        { customerRef: oldCustomer.mobile },
        { customerRef: customer.mobile }
      );
    }

    return NextResponse.json({ 
      message: 'Customer and booking updated successfully',
      customer 
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ 
      error: 'Failed to update customer',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE endpoint to remove a customer
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerRef = searchParams.get('customerRef');

    if (!customerRef) {
      return NextResponse.json(
        { error: 'Customer reference is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get customer's mobile before deletion
    const customer = await Customer.findOne({ customerRef });
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Delete the customer
    await Customer.deleteOne({ customerRef: customerRef.trim() });
    
    // Delete corresponding booking
    await Booking.deleteOne({ customerRef: customer.mobile });

    return NextResponse.json(
      { message: 'Customer and booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 