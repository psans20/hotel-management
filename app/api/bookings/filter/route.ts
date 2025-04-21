import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Booking from '@/app/models/Booking';

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

    const db = await connectToDatabase();

    // Build the query based on the field
    let query: any = {};
    
    switch (field) {
      case 'bookingRef':
      case 'customerRef':
      case 'roomNumber':
        query[field] = value;
        break;
      case 'checkInDate':
      case 'checkOutDate':
        query[field] = new Date(value);
        break;
      case 'status':
        query[field] = value;
        break;
      case 'roomType':
        query[field] = value;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid search field' },
          { status: 400 }
        );
    }

    // Find bookings matching the query
    const bookings = await Booking.find(query)
      .sort({ checkInDate: -1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error filtering bookings:', error);
    return NextResponse.json(
      { error: 'Failed to filter bookings' },
      { status: 500 }
    );
  }
} 