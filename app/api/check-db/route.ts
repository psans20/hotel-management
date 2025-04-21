import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hotel_management'
    });

    // Check if bookings table exists
    const [tables] = await connection.execute(`
      SHOW TABLES LIKE 'bookings'
    `);

    await connection.end();

    const tableExists = Array.isArray(tables) && tables.length > 0;

    return NextResponse.json({ 
      tableExists,
      message: tableExists ? 'Bookings table exists' : 'Bookings table does not exist'
    });
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json(
      { error: 'Failed to check database', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 