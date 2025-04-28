const mongoose = require('mongoose');

// Define the Booking schema minimally for this script
const bookingSchema = new mongoose.Schema({}, { strict: false });
const Booking = mongoose.model('Booking', bookingSchema, 'bookings');

async function fixMissingBookingRefs() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set.');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  // Find bookings missing bookingRef or with empty bookingRef
  const bookings = await Booking.find({ $or: [ { bookingRef: { $exists: false } }, { bookingRef: '' } ] });
  console.log(`Found ${bookings.length} bookings missing bookingRef.`);

  let updatedCount = 0;
  for (const booking of bookings) {
    // Generate a unique bookingRef
    const newRef = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
    booking.bookingRef = newRef;
    await booking.save();
    updatedCount++;
    console.log(`Updated booking _id=${booking._id} with bookingRef=${newRef}`);
  }

  console.log(`Updated ${updatedCount} bookings.`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB Atlas');
}

fixMissingBookingRefs().catch(err => {
  console.error('Error fixing bookingRefs:', err);
  process.exit(1);
}); 