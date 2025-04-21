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

    // Create bookings table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customerPhone VARCHAR(20) NOT NULL,
        checkInDate DATE NOT NULL,
        checkOutDate DATE NOT NULL,
        roomType VARCHAR(20) NOT NULL,
        roomNo VARCHAR(10) NOT NULL,
        meal VARCHAR(20) NOT NULL,
        noOfDays INT NOT NULL,
        paidTax DECIMAL(10, 2) NOT NULL,
        actualTotal DECIMAL(10, 2) NOT NULL,
        totalCost DECIMAL(10, 2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customerPhone) REFERENCES customers(phone)
      )
    `);

    await connection.end();

    return NextResponse.json({ 
      success: true,
      message: 'Bookings table created or already exists'
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { error: 'Failed to set up database', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 