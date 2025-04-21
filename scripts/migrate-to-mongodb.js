// This script migrates data from MySQL to MongoDB
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const Customer = require('../app/models/Customer');

// MySQL connection configuration
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'hoteluser',
  password: process.env.DB_PASSWORD || 'hotelpass',
  database: process.env.DB_NAME || 'hotel_management',
};

// MongoDB connection URI
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management';

async function migrateData() {
  console.log('Starting migration from MySQL to MongoDB...');
  
  // Connect to MySQL
  console.log('Connecting to MySQL...');
  const mysqlConnection = await mysql.createConnection(mysqlConfig);
  console.log('Connected to MySQL');
  
  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  
  try {
    // Fetch all customers from MySQL
    console.log('Fetching customers from MySQL...');
    const [customers] = await mysqlConnection.execute('SELECT * FROM customers');
    console.log(`Found ${customers.length} customers in MySQL`);
    
    // Clear existing customers in MongoDB
    console.log('Clearing existing customers in MongoDB...');
    await Customer.deleteMany({});
    console.log('Cleared existing customers in MongoDB');
    
    // Insert customers into MongoDB
    console.log('Inserting customers into MongoDB...');
    for (const customer of customers) {
      await Customer.create({
        customerRef: customer.customerRef,
        customerName: customer.customerName,
        motherName: customer.motherName || '',
        gender: customer.gender,
        postCode: customer.postCode || '',
        mobile: customer.mobile,
        email: customer.email,
        nationality: customer.nationality || 'American',
        idProofType: customer.idProofType || 'DrivingLicence',
        idNumber: customer.idNumber || '',
        address: customer.address || '',
      });
    }
    console.log(`Inserted ${customers.length} customers into MongoDB`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close connections
    await mysqlConnection.end();
    await mongoose.disconnect();
    console.log('Connections closed');
  }
}

// Run the migration
migrateData(); 