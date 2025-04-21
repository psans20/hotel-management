import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Customer from '@/app/models/Customer';
import Booking from '@/app/models/Booking';

export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get all customers
    const customers = await Customer.find({});
    console.log(`Found ${customers.length} customers`);
    
    // Create bookings for each customer
    const bookings = customers.map(customer => {
      // Generate a unique booking reference
      const bookingRef = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Set default dates (today and tomorrow)
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return {
        bookingRef,
        customerRef: customer.mobile, // Using mobile as customer reference
        roomNumber: '101', // Default room
        checkInDate: today,
        checkOutDate: tomorrow,
        numberOfGuests: 1,
        roomType: 'Standard',
        meal: 'None',
        noOfDays: 1,
        paidTax: 10,
        actualTotal: 100,
        totalCost: 110,
        totalAmount: 110,
        status: 'Pending'
      };
    });
    
    // Insert the bookings
    const result = await Booking.insertMany(bookings);
    
    return NextResponse.json({ 
      message: 'Customer mobiles migrated to bookings successfully',
      count: result.length
    });
  } catch (error) {
    console.error('Error migrating customer mobiles:', error);
    return NextResponse.json({ 
      error: 'Failed to migrate customer mobiles',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 