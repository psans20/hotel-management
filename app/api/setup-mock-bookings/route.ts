import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Booking from '@/app/models/Booking';
import { mockBookings } from '@/app/data/mockData';

export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('Cleared existing bookings');
    
    // Transform mock bookings to match the Booking model schema
    const transformedBookings = mockBookings.map(booking => {
      // Generate a unique booking reference
      const bookingRef = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Convert date strings to Date objects
      const [checkInDay, checkInMonth, checkInYear] = booking.checkInDate.split('/');
      const [checkOutDay, checkOutMonth, checkOutYear] = booking.checkOutDate.split('/');
      
      const checkInDate = new Date(`${checkInYear}-${checkInMonth}-${checkInDay}`);
      const checkOutDate = new Date(`${checkOutYear}-${checkOutMonth}-${checkOutDay}`);
      
      // Parse numerical values from strings
      const noOfDays = parseInt(booking.noOfDays);
      const paidTax = parseFloat(booking.paidTax);
      const actualTotal = parseFloat(booking.actualTotal);
      const totalCost = parseFloat(booking.totalCost);
      
      // Map room types to match the schema enum
      const roomTypeMap: { [key: string]: string } = {
        'Double': 'Standard',
        'Luxury': 'Deluxe'
      };
      
      // Map meal types to match the schema enum
      const mealMap: { [key: string]: string } = {
        'Breakfast': 'Breakfast',
        'Dinner': 'Half Board'
      };
      
      return {
        bookingRef,
        customerRef: booking.customerPhone,
        roomNumber: booking.roomNo,
        checkInDate,
        checkOutDate,
        numberOfGuests: 1,
        roomType: roomTypeMap[booking.roomType] || 'Standard',
        meal: mealMap[booking.meal] || 'None',
        noOfDays,
        paidTax,
        actualTotal,
        totalCost,
        totalAmount: totalCost,
        status: 'Pending',
        paymentStatus: 'Pending'
      };
    });
    
    // Insert the transformed bookings
    const result = await Booking.insertMany(transformedBookings);
    console.log(`Inserted ${result.length} mock bookings`);
    
    return NextResponse.json({ 
      message: 'Mock bookings migrated successfully',
      count: result.length
    });
  } catch (error) {
    console.error('Error migrating mock bookings:', error);
    return NextResponse.json({ 
      error: 'Failed to migrate mock bookings',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 