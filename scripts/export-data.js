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

async function exportData() {
  try {
    // Connect to local MongoDB
    console.log('Connecting to local MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/hotel_management');
    console.log('Connected to local MongoDB');

    // Export customers
    console.log('Exporting customers...');
    const customers = await Customer.find({});
    await fs.writeFile(
      path.join(__dirname, 'exported-data', 'customers.json'),
      JSON.stringify(customers, null, 2)
    );
    console.log(`Exported ${customers.length} customers`);

    // Export bookings
    console.log('Exporting bookings...');
    const bookings = await Booking.find({});
    await fs.writeFile(
      path.join(__dirname, 'exported-data', 'bookings.json'),
      JSON.stringify(bookings, null, 2)
    );
    console.log(`Exported ${bookings.length} bookings`);

    console.log('Data export completed successfully!');
  } catch (error) {
    console.error('Error during export:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Create exported-data directory if it doesn't exist
fs.mkdir(path.join(__dirname, 'exported-data'), { recursive: true })
  .then(() => exportData())
  .catch(console.error); 