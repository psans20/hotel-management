const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Define the schema directly since we can't import TypeScript files
const customerSchema = new mongoose.Schema({
  customerRef: String,
  customerName: String,
  motherName: String,
  gender: String,
  postCode: String,
  mobile: String,
  email: String,
  nationality: String,
  idProofType: String,
  idNumber: String,
  address: String
});

const bookingSchema = new mongoose.Schema({
  customerRef: String,
  checkInDate: Date,
  checkOutDate: Date,
  roomType: String,
  roomNo: String,
  meal: String,
  noOfDays: Number,
  paidTax: Number,
  actualTotal: Number,
  totalCost: Number
});

const Customer = mongoose.model('Customer', customerSchema);
const Booking = mongoose.model('Booking', bookingSchema);

async function importData() {
  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    const atlasUri = process.env.MONGODB_URI;
    if (!atlasUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    await mongoose.connect(atlasUri);
    console.log('Connected to MongoDB Atlas');

    // Import customers
    console.log('Importing customers...');
    const customersData = JSON.parse(
      await fs.readFile(
        path.join(__dirname, 'exported-data', 'customers.json'),
        'utf8'
      )
    );
    await Customer.deleteMany({}); // Clear existing customers
    await Customer.insertMany(customersData);
    console.log(`Imported ${customersData.length} customers`);

    // Import bookings
    console.log('Importing bookings...');
    const bookingsData = JSON.parse(
      await fs.readFile(
        path.join(__dirname, 'exported-data', 'bookings.json'),
        'utf8'
      )
    );
    await Booking.deleteMany({}); // Clear existing bookings
    await Booking.insertMany(bookingsData);
    console.log(`Imported ${bookingsData.length} bookings`);

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

importData(); 