import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Customer from '@/app/models/Customer';
import Booking from '@/app/models/Booking';

export async function POST() {
  try {
    await connectToDatabase();
    
    // Get all customers from Customer collection
    const customers = await Customer.find({});
    
    // Get all valid mobile numbers
    const validMobiles = customers.map(customer => customer.mobile);
    
    // Remove bookings with mobile numbers that don't exist in Customer collection
    await Booking.deleteMany({
      customerRef: { $nin: validMobiles }
    });
    
    // Create/Update booking entries for each customer's mobile
    const bookingPromises = customers.map(async (customer) => {
      return await Booking.findOneAndUpdate(
        { customerRef: customer.mobile },
        {
          $setOnInsert: {
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
          }
        },
        { upsert: true, new: true }
      );
    });

    await Promise.all(bookingPromises);
    
    const bookingCount = await Booking.countDocuments();
    
    return NextResponse.json({ 
      message: 'Mobile numbers synced and invalid entries removed',
      totalBookings: bookingCount
    });
    
  } catch (error) {
    console.error('Error syncing mobile numbers:', error);
    return NextResponse.json({ 
      error: 'Failed to sync mobile numbers',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 