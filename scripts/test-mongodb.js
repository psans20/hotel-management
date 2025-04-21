const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/hotel_management');
    console.log('Successfully connected to MongoDB!');
    
    // Test the connection with a ping
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    console.log('MongoDB ping result:', result);
    
    await mongoose.connection.close();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection(); 