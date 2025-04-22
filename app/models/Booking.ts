import mongoose from 'mongoose';

// Define the schema for the Booking model
const bookingSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customerRef: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Suite', 'Executive']
  },
  specialRequests: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  meal: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'None'],
    default: 'Breakfast'
  },
  noOfDays: {
    type: Number,
    required: true,
    min: 1
  },
  paidTax: {
    type: Number,
    required: true,
    min: 0
  },
  actualTotal: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
bookingSchema.index({ bookingRef: 1 });
bookingSchema.index({ customerRef: 1 });
bookingSchema.index({ checkInDate: 1 });
bookingSchema.index({ checkOutDate: 1 });
bookingSchema.index({ roomNumber: 1 });

// Add validation for check-out date to be after check-in date
bookingSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Calculate number of days and total cost before saving
bookingSchema.pre('save', function(next) {
  if (this.checkInDate && this.checkOutDate) {
    const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
    this.noOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate total cost based on room type and number of days
    const roomRates = {
      'Standard': 100,
      'Deluxe': 150,
      'Suite': 250,
      'Executive': 300
    };
    
    this.totalCost = roomRates[this.roomType] * this.noOfDays;
    this.actualTotal = this.totalCost + this.paidTax;
  }
  next();
});

// Create the model if it doesn't exist, otherwise use the existing one
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking; 