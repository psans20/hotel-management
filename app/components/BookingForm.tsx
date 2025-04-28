'use client';

import { useState, useEffect } from 'react';
import { mockCustomers } from '../data/mockData';
import { useCustomerStore, Customer } from '../store/customerStore';
import Link from 'next/link';

interface CustomerData {
  name: string;
  gender: string;
  mobile: string;
  email: string;
  nationality: string;
  address: string;
  customerRef: string;
  motherName: string;
  postCode: string;
  idProofType: string;
  idNumber: string;
}

interface BookingData {
  bookingRef: string;
  customerRef: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  roomType: string;
  meal: string;
  noOfDays: number;
  paidTax: number;
  actualTotal: number;
  totalCost: number;
  totalAmount: number;
  status: string;
}

interface BookingFormData {
  bookingRef: string;
  mobile: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  roomType: string;
  meal: string;
  noOfDays: string;
  paidTax: string;
  actualTotal: string;
  totalCost: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    bookingRef: '',
    mobile: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    totalAmount: 0,
    roomType: 'Standard',
    meal: 'Breakfast',
    noOfDays: '',
    paidTax: '',
    actualTotal: '',
    totalCost: ''
  });

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [searchBy, setSearchBy] = useState('Select Option');
  const [searchValue, setSearchValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [customerMobiles, setCustomerMobiles] = useState<Array<{mobile: string, name: string}>>([]);

  // Subscribe to customer store changes
  const { customers: storeCustomers } = useCustomerStore();

  // Fetch customer mobile numbers on component mount
  useEffect(() => {
    fetchCustomerMobiles();
    fetchBookings();
  }, []);

  const fetchCustomerMobiles = async () => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      const customersData = await response.json();
      console.log('Fetched customers:', customersData); // Debug log
      
      if (!Array.isArray(customersData)) {
        throw new Error('Invalid customer data received');
      }
      
      // Sort customers by name for better UX
      const sortedCustomers = customersData.sort((a: any, b: any) => 
        a.customerName.localeCompare(b.customerName)
      );
      
      // Map customers for the dropdown
      const mobiles = sortedCustomers.map((customer: any) => ({
        mobile: customer.mobile,
        name: customer.customerName
      }));
      
      // Map customers for the details display
      const mappedCustomers = sortedCustomers.map((customer: any) => ({
        name: customer.customerName,
        gender: customer.gender,
        mobile: customer.mobile,
        email: customer.email,
        nationality: customer.nationality,
        address: customer.address,
        customerRef: customer.customerRef,
        motherName: customer.motherName,
        postCode: customer.postCode,
        idProofType: customer.idProofType,
        idNumber: customer.idNumber
      }));
      
      console.log('Processed customer mobiles:', mobiles); // Debug log
      setCustomerMobiles(mobiles);
      setCustomers(mappedCustomers);
    } catch (error) {
      console.error('Error fetching customer mobiles:', error);
      setError('Failed to load customer data');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const bookingsData = await response.json();
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Generate a booking reference if not provided
      if (!formData.bookingRef) {
        formData.bookingRef = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Convert string values to numbers
      const bookingData = {
        ...formData,
        numberOfGuests: parseInt(formData.numberOfGuests.toString()),
        totalAmount: parseFloat(formData.totalCost.replace('£', '')),
        noOfDays: parseInt(formData.noOfDays),
        paidTax: parseFloat(formData.paidTax.replace('£', '')),
        actualTotal: parseFloat(formData.actualTotal.replace('£', '')),
        totalCost: parseFloat(formData.totalCost.replace('£', '')),
        customerRef: formData.mobile, // Using mobile as customer reference
        status: 'Pending'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      // Reset form after successful submission
      setFormData({
        bookingRef: '',
        mobile: '',
        roomNumber: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        totalAmount: 0,
        roomType: 'Standard',
        meal: 'Breakfast',
        noOfDays: '',
        paidTax: '',
        actualTotal: '',
        totalCost: ''
      });

      setModalMessage('Booking created successfully!');
      setShowModal(true);
      
      // Refresh the bookings list
      fetchBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const calculateCosts = (days: number, roomType: string) => {
    let costPerNight = 0;
    let taxPerNight = 0;

    switch (roomType) {
      case 'Standard':
        costPerNight = 100;
        taxPerNight = 10;
        break;
      case 'Deluxe':
        costPerNight = 150;
        taxPerNight = 15;
        break;
      case 'Suite':
        costPerNight = 250;
        taxPerNight = 25;
        break;
      case 'Executive':
        costPerNight = 300;
        taxPerNight = 30;
        break;
      default:
        costPerNight = 100; // Default to Standard room rate
        taxPerNight = 10;
    }

    const actualTotal = days * costPerNight;
    const paidTax = days * taxPerNight;
    const totalCost = actualTotal + paidTax;
    return { actualTotal, paidTax, totalCost };
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Always try to update the booking
      const days = Math.ceil(
        (new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) 
        / (1000 * 60 * 60 * 24)
      );
      const { actualTotal, paidTax, totalCost } = calculateCosts(days, formData.roomType);
      const bookingData = {
        bookingRef: formData.bookingRef,
        customerRef: formData.mobile,
        roomNumber: formData.roomNumber,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: 1,
        roomType: formData.roomType,
        meal: formData.meal,
        noOfDays: days,
        paidTax: parseFloat(paidTax.toString()),
        actualTotal: parseFloat(actualTotal.toString()),
        totalCost: parseFloat(totalCost.toString()),
        totalAmount: parseFloat(totalCost.toString()),
        status: 'Pending'
      };
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      if (!response.ok) {
        setModalMessage(data.error || data.details || 'Failed to update booking');
        setShowModal(true);
      } else {
        setModalMessage('Booking Updated Successfully');
        setShowModal(true);
        setFormData(prev => ({
          ...prev,
          noOfDays: days.toString(),
          paidTax: paidTax.toString(),
          actualTotal: actualTotal.toString(),
          totalCost: totalCost.toString()
        }));
        await fetchBookings();
      }
    } catch (error) {
      setModalMessage(error instanceof Error ? error.message : 'Failed to update booking');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  
  const handleReset = () => {
    setFormData({
      bookingRef: '',
      mobile: '',
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      totalAmount: 0,
      roomType: 'Standard',
      meal: 'Breakfast',
      noOfDays: '',
      paidTax: '',
      actualTotal: '',
      totalCost: ''
    });
    setSelectedCustomer(null);
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // If it's a Date object or ISO string
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    // If in DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  };

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const mapStoreCustomerToCustomerData = (customer: Customer): CustomerData => ({
    name: customer.customerName,
    gender: customer.gender,
    mobile: customer.mobile,
    email: customer.email,
    nationality: customer.nationality,
    address: customer.address,
    customerRef: customer.customerRef,
    motherName: customer.motherName,
    postCode: customer.postCode,
    idProofType: customer.idProofType,
    idNumber: customer.idNumber
  });

  useEffect(() => {
    // When store customers change, update our local customers state
    const mappedCustomers = storeCustomers.map(mapStoreCustomerToCustomerData);
    console.log('Store customers mapped:', mappedCustomers);
    setCustomers(mappedCustomers);
  }, [storeCustomers]);

  const fetchCustomersFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get customers from the API
      const response = await fetch('/api/customers/filter');
      const data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        // Map API data to CustomerData format
        const mappedApiData = data.map((customer: any) => ({
          name: customer.customerName,
          gender: customer.gender,
          mobile: customer.mobile,
          email: customer.email,
          nationality: customer.nationality,
          address: customer.address,
          customerRef: customer.customerRef,
          motherName: customer.motherName,
          postCode: customer.postCode,
          idProofType: customer.idProofType,
          idNumber: customer.idNumber
        }));
        setCustomers(mappedApiData);
      } else {
        // If API fails, use the store customers
        const mappedCustomers = storeCustomers.map(mapStoreCustomerToCustomerData);
        console.log('Using store customers:', mappedCustomers);
        setCustomers(mappedCustomers);
      }

      // Now fetch bookings
      await fetchBookings();
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      // Use store customers as fallback
      const mappedCustomers = storeCustomers.map(mapStoreCustomerToCustomerData);
      console.log('Using store customers as fallback:', mappedCustomers);
      setCustomers(mappedCustomers);
    } finally {
      setLoading(false);
    }
  };

  const handleBillClick = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      alert('Please select both check-in and check-out dates');
      return;
    }

    const days = Math.ceil(
      (new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) 
      / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const { actualTotal, paidTax, totalCost } = calculateCosts(days, formData.roomType);
    
    setFormData(prev => ({
      ...prev,
      noOfDays: days.toString(),
      paidTax: paidTax.toString(),
      actualTotal: actualTotal.toString(),
      totalCost: totalCost.toString()
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (newData.checkInDate && newData.checkOutDate) {
        const days = Math.ceil(
          (new Date(newData.checkOutDate).getTime() - new Date(newData.checkInDate).getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        if (days > 0) {
          const { actualTotal, paidTax, totalCost } = calculateCosts(days, newData.roomType);
          return {
            ...newData,
            noOfDays: days.toString(),
            actualTotal: actualTotal.toString(),
            paidTax: paidTax.toString(),
            totalCost: totalCost.toString()
          };
        }
      }
      return newData;
    });
  };

  const handleDelete = async () => {
    if (!formData.bookingRef) {
      alert('Please fetch a booking first');
      return;
    }

    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings?bookingRef=${formData.bookingRef}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete booking');
      }

      if (data.success) {
        alert(data.message);
        handleReset();
        
        // Refresh the bookings list after deletion
        fetchBookings();
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete booking');
    }
  };

  // Function to format date to DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Function to parse DD/MM/YYYY to YYYY-MM-DD
  const parseDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Function to handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Function to handle search
  const handleSearch = async () => {
    if (!searchValue) {
      setFilteredBookings(bookings);
      return;
    }

    try {
      let field = 'customerRef';
      if (searchBy === 'Room No') {
        field = 'roomNumber';
      }
      
      const response = await fetch(`/api/bookings/filter?field=${field}&value=${searchValue}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error searching bookings:', error);
      setFilteredBookings([]);
    }
  };

  // Function to handle show all
  const handleShowAll = () => {
    setSearchValue('');
    setSearchBy('Select Option');
    fetchBookings();
  };

  // Handle customer selection from the table
  const handleCustomerSelect = (customer: CustomerData) => {
    if (!customer) return;
    
    setSelectedCustomer(customer);
    
    // Find the booking for this customer and set bookingRef
    const existingBooking = bookings.find(
      b => normalizePhone(b.customerRef) === normalizePhone(customer.mobile)
    );

    setFormData(prev => ({
      ...prev,
      mobile: customer.mobile,
      bookingRef: existingBooking ? existingBooking.bookingRef : ''
    }));
  };

  const handleCustomerUpdate = async () => {
    if (!selectedCustomer) {
      setModalMessage('No customer selected');
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerRef: selectedCustomer.customerRef,
          customerName: selectedCustomer.name,
          gender: selectedCustomer.gender,
          mobile: selectedCustomer.mobile,
          email: selectedCustomer.email,
          nationality: selectedCustomer.nationality,
          address: selectedCustomer.address,
          motherName: selectedCustomer.motherName,
          postCode: selectedCustomer.postCode,
          idProofType: selectedCustomer.idProofType,
          idNumber: selectedCustomer.idNumber
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update customer');
      }

      // Update the local customer data
      setSelectedCustomer(data.customer);
      setModalMessage('Customer updated successfully');
      setShowModal(true);

      // Refresh customer data
      await fetchCustomerMobiles();
      
      // If there's an existing booking for this customer, update it too
      const existingBooking = bookings.find(b => b.customerRef === selectedCustomer.mobile);
      if (existingBooking) {
        setFormData(prev => ({
          ...prev,
          bookingRef: existingBooking.bookingRef,
          mobile: selectedCustomer.mobile
        }));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to update customer');
      setModalMessage(error instanceof Error ? error.message : 'Failed to update customer');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerDetailChange = (field: keyof CustomerData, value: string) => {
    if (!selectedCustomer) return;
    setSelectedCustomer(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Add a helper to normalize phone numbers
  const normalizePhone = (phone: string) => phone ? phone.replace(/^0+/, '') : '';

  const handleFetchData = async () => {
    if (!formData.mobile) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Find customer in our customers state (which contains API data)
      const existingCustomer = customers.find(c => normalizePhone(c.mobile) === normalizePhone(formData.mobile));
      
      if (!existingCustomer) {
        setError('This customer does not exist. Please add them in Customer Form first.');
        setSelectedCustomer(null);
        return;
      }

      // Set the selected customer
      setSelectedCustomer(existingCustomer);

      // Find any existing booking for this customer (normalize phone numbers)
      const existingBooking = bookings.find(b => normalizePhone(b.customerRef) === normalizePhone(formData.mobile));
      if (existingBooking) {
        setFormData(prev => ({
          ...prev,
          bookingRef: existingBooking.bookingRef,
          checkInDate: formatDateForInput(existingBooking.checkInDate),
          checkOutDate: formatDateForInput(existingBooking.checkOutDate),
          roomType: existingBooking.roomType === 'Single' ? 'Standard' : existingBooking.roomType,
          roomNumber: existingBooking.roomNumber || '101',
          meal: existingBooking.meal || 'Breakfast',
          noOfDays: existingBooking.noOfDays.toString(),
          paidTax: existingBooking.paidTax.toString(),
          actualTotal: existingBooking.actualTotal.toString(),
          totalCost: existingBooking.totalCost.toString(),
          numberOfGuests: existingBooking.numberOfGuests
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.mobile) {
      handleFetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.mobile]);

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 md:hidden">
        <h1 className="text-2xl font-bold mb-4">This is not viewable on mobile,</h1>
        <p className="text-lg">please switch to desktop to view website</p>
      </div>
      {/* Main content, hidden on mobile */}
      <div className="hidden md:flex flex-col gap-6 md:flex-row">
        {/* Left side - Room Booking Form */}
        <div className="w-full md:w-1/3 bg-white p-4 border rounded mb-4 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm">Customer Phone No</label>
              <div className="flex gap-2">
                <select
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="flex-1 border p-1.5 text-sm"
                >
                  <option value="">Select a customer</option>
                  {customerMobiles.map((customer) => (
                    <option key={customer.mobile} value={customer.mobile}>
                      {customer.name} ({customer.mobile})
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  className="bg-black text-yellow-400 px-3 py-1 text-sm"
                  onClick={handleFetchData}
                  disabled={loading}
                >
                  {loading ? 'Fetching...' : 'Fetch Data'}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-sm">Check-in Date:</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleDateChange}
                className="w-full border p-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm">Check-out Date:</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleDateChange}
                className="w-full border p-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm">Room Type:</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={(e) => {
                  handleChange(e);
                  if (formData.checkInDate && formData.checkOutDate) {
                    const days = Math.ceil(
                      (new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) 
                      / (1000 * 60 * 60 * 24)
                    );
                    if (days > 0) {
                      const { actualTotal, paidTax, totalCost } = calculateCosts(days, e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        roomType: e.target.value,
                        noOfDays: days.toString(),
                        actualTotal: actualTotal.toString(),
                        paidTax: paidTax.toString(),
                        totalCost: totalCost.toString()
                      }));
                      return;
                    }
                  }
                  setFormData(prev => ({
                    ...prev,
                    roomType: e.target.value
                  }));
                }}
                className="w-full border p-1.5 text-sm"
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Available Room:</label>
              {(() => {
                // Generate all room numbers from 100 to 150
                const allRooms = Array.from({ length: 51 }, (_, i) => (100 + i).toString());
                // Get all taken room numbers
                const takenRooms = bookings
                  .map(b => b.roomNumber)
                  .filter(room => room);
                // Filter out taken rooms
                const availableRooms = allRooms.filter(room => !takenRooms.includes(room));
                return (
                  <select
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="w-full border p-1.5 text-sm"
                  >
                    {availableRooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                );
              })()}
            </div>
            <div>
              <label className="block text-sm">Meal:</label>
              <select
                name="meal"
                value={formData.meal}
                onChange={handleChange}
                className="w-full border p-1.5 text-sm"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">No Of Days:</label>
              <input
                type="text"
                name="noOfDays"
                value={formData.noOfDays}
                className="w-full border p-1.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm">Paid Tax:</label>
              <input
                type="text"
                name="paidTax"
                value={formData.paidTax ? formatCurrency(parseFloat(formData.paidTax.replace('£', ''))) : ''}
                className="w-full border p-1.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm">Actual Total:</label>
              <input
                type="text"
                name="actualTotal"
                value={formData.actualTotal ? formatCurrency(parseFloat(formData.actualTotal.replace('£', ''))) : ''}
                className="w-full border p-1.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm">Total Cost:</label>
              <input
                type="text"
                name="totalCost"
                value={formData.totalCost ? formatCurrency(parseFloat(formData.totalCost.replace('£', ''))) : ''}
                className="w-full border p-1.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <button 
                type="button" 
                onClick={handleBillClick}
                className="w-full bg-black text-yellow-400 px-4 py-1 text-sm mb-2"
              >
                Bill
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full bg-black text-yellow-400 px-4 py-1 text-sm"
              >
                Update
              </button>
            </div>
          </form>
        </div>

        {/* Right side - View Booking Details & Search */}
        <div className="w-full flex-1 bg-white p-4 border rounded">
          <h2 className="text-lg font-semibold mb-4">View Customer Details & Search System</h2>
          
          {/* Customer Details Box */}
          {selectedCustomer && (
            <div className="mb-4 border rounded">
              <div className="grid grid-cols-2 text-sm">
                <div className="border-b border-r p-2">
                  <span className="font-semibold">Name:</span> {selectedCustomer.name}
                </div>
                <div className="border-b p-2">
                  <span className="font-semibold">Gender:</span> {selectedCustomer.gender}
                </div>
                <div className="border-b border-r p-2">
                  <span className="font-semibold">Email:</span> {selectedCustomer.email}
                </div>
                <div className="border-b p-2">
                  <span className="font-semibold">Nationality:</span> {selectedCustomer.nationality}
                </div>
                <div className="border-b border-r p-2">
                  <span className="font-semibold">Address:</span> {selectedCustomer.address}
                </div>
                <div className="border-b p-2">
                  <span className="font-semibold">Contact:</span> {selectedCustomer.mobile}
                </div>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <span className="bg-red-500 text-white px-2 py-1 text-sm mr-2">Search By</span>
              <select 
                className="border p-1.5 text-sm"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
              >
                <option>Select Option</option>
                <option>Mobile</option>
                <option>Room No</option>
              </select>
            </div>
            <input 
              type="text" 
              className="border p-1.5 text-sm flex-1" 
              placeholder={searchBy === 'Mobile' ? "Enter mobile number..." : "Enter room number..."}
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button 
              className="bg-green-700 text-white px-4 py-1.5 text-sm"
              onClick={handleSearch}
            >
              SEARCH
            </button>
            <button 
              className="bg-green-700 text-white px-4 py-1.5 text-sm"
              onClick={handleShowAll}
            >
              SHOW ALL
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-1.5 text-left">Mobile</th>
                  <th className="border p-1.5 text-left">Check-in</th>
                  <th className="border p-1.5 text-left">Check-out</th>
                  <th className="border p-1.5 text-left">Room Type</th>
                  <th className="border p-1.5 text-left">Room No</th>
                  <th className="border p-1.5 text-left">Meal</th>
                  <th className="border p-1.5 text-left">No/Days</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking: BookingData, idx) => (
                  <tr
                    key={booking.bookingRef ? booking.bookingRef : `booking-${idx}`}
                    onClick={() => {
                      const customer = customers.find(c => c.mobile === booking.customerRef);
                      if (customer) {
                        handleCustomerSelect(customer);
                        setFormData({
                          bookingRef: booking.bookingRef,
                          mobile: customer.mobile,
                          checkInDate: formatDateForInput(booking.checkInDate),
                          checkOutDate: formatDateForInput(booking.checkOutDate),
                          roomType: booking.roomType === 'Single' ? 'Standard' : booking.roomType,
                          roomNumber: booking.roomNumber,
                          meal: booking.meal,
                          noOfDays: booking.noOfDays.toString(),
                          numberOfGuests: booking.numberOfGuests,
                          paidTax: booking.paidTax.toString(),
                          actualTotal: booking.actualTotal.toString(),
                          totalCost: booking.totalCost.toString(),
                          totalAmount: booking.totalAmount,
                        });
                      }
                    }}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="border p-1.5">{booking.customerRef}</td>
                    <td className="border p-1.5">{formatDate(booking.checkInDate)}</td>
                    <td className="border p-1.5">{formatDate(booking.checkOutDate)}</td>
                    <td className="border p-1.5">{booking.roomType}</td>
                    <td className="border p-1.5">{booking.roomNumber}</td>
                    <td className="border p-1.5">{booking.meal}</td>
                    <td className="border p-1.5">{booking.noOfDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{modalMessage}</h3>
            <button
              onClick={() => setShowModal(false)}
              className="bg-black text-yellow-400 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
} 