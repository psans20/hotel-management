const mongoose = require('mongoose');
const path = require('path');
const Customer = require(path.join(__dirname, 'models', 'Customer'));
const { originalMockCustomers } = require(path.join(__dirname, 'data', 'mockData'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management';

async function migrateMockData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing customers
    console.log('Clearing existing customers...');
    await Customer.deleteMany({});
    console.log('Cleared existing customers');

    // Insert mock customers
    console.log('Inserting mock customers...');
    for (const customer of originalMockCustomers) {
      await Customer.create({
        customerRef: customer.customerRef,
        customerName: customer.customerName,
        motherName: customer.motherName,
        gender: customer.gender,
        postCode: customer.postCode,
        mobile: customer.mobile,
        email: customer.email,
        nationality: customer.nationality,
        idProofType: customer.idProofType,
        idNumber: customer.idNumber,
        address: customer.address
      });
    }
    console.log(`Inserted ${originalMockCustomers.length} customers`);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateMockData(); 