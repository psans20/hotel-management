const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const { originalMockCustomers } = require('./data/mockData');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management';

async function migrateCustomers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Get existing customers from MongoDB
    const existingCustomers = await Customer.find({});
    console.log(`Found ${existingCustomers.length} existing customers in MongoDB`);

    // Process each customer
    for (const customer of originalMockCustomers) {
      try {
        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ customerRef: customer.customerRef });
        
        if (existingCustomer) {
          console.log(`Customer ${customer.customerRef} already exists, skipping...`);
          continue;
        }

        // Create new customer document
        const newCustomer = new Customer({
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

        // Save the customer
        await newCustomer.save();
        console.log(`Successfully migrated customer: ${customer.customerRef}`);
      } catch (error) {
        console.error(`Error migrating customer ${customer.customerRef}:`, error.message);
      }
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Closed MongoDB connection');
  }
}

// Run the migration
migrateCustomers(); 