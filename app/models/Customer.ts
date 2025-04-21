import mongoose from 'mongoose';

// Define the schema for the Customer model
const customerSchema = new mongoose.Schema({
  customerRef: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  postCode: {
    type: String,
    default: '',
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    default: 'American',
  },
  idProofType: {
    type: String,
    default: 'DrivingLicence',
  },
  idNumber: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Create the model if it doesn't exist, otherwise use the existing one
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer; 