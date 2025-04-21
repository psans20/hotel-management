import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request) {
  try {
    // Get the phone number from the search params
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Get customer by phone number
    const [rows] = await connection.execute(
      'SELECT * FROM customers WHERE mobile = ?',
      [phone]
    );
    
    await connection.end();

    // If no customer found, return 404
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Return the customer data
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error searching customer:', error);
    return NextResponse.json(
      { error: 'Failed to search customer' },
      { status: 500 }
    );
  }
} 