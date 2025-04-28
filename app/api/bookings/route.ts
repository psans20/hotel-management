import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Booking from '@/app/models/Booking';

// GET endpoint to fetch all bookings
export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await Booking.find({}).sort({ checkInDate: 1 });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch bookings',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST endpoint to add a new booking
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['customerRef', 'roomNumber', 'checkInDate', 'checkOutDate', 'numberOfGuests', 'roomType', 'totalAmount'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    // Generate a booking reference if not provided
    if (!data.bookingRef) {
      data.bookingRef = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    // Check if bookingRef already exists
    const existingBooking = await Booking.findOne({ bookingRef: data.bookingRef });
    if (existingBooking) {
      return NextResponse.json({ 
        error: 'Booking reference already exists' 
      }, { status: 409 });
    }
    
    // Convert date strings to Date objects
    if (typeof data.checkInDate === 'string') {
      data.checkInDate = new Date(data.checkInDate);
    }
    
    if (typeof data.checkOutDate === 'string') {
      data.checkOutDate = new Date(data.checkOutDate);
    }
    
    const booking = new Booking(data);
    await booking.save();
    
    // Return the created booking
    return NextResponse.json({ 
      message: 'Booking created successfully',
      booking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ 
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT endpoint to update a booking
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const booking = await request.json();
    const { customerRef, ...updateData } = booking;

    if (!customerRef) {
      return NextResponse.json({
        error: 'Customer reference (mobile) is required'
      }, { status: 400 });
    }

    // Debug log
    console.log('PUT /api/bookings received:', { customerRef, updateData });

    // Find and update the booking by customerRef
    const updatedBooking = await Booking.findOneAndUpdate(
      { customerRef },
      updateData,
      { new: true, runValidators: true }
    );
    console.log('PUT /api/bookings updated:', updatedBooking);

    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Return the updated booking data
    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });

  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update booking',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a booking
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingRef = searchParams.get('bookingRef');

    if (!bookingRef) {
      return NextResponse.json(
        { error: 'Booking reference is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    console.log('Attempting to delete booking with reference:', bookingRef);
    
    // Use the Booking model to delete
    const result = await Booking.deleteOne({ bookingRef: bookingRef.trim() });
    
    console.log('Delete result:', result);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
} 