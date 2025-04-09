'use client';

import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    customerPhone: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: 'Single',
    availableRoom: '101',
    meal: 'Breakfast',
    noOfDays: '',
    paidTax: '',
    actualTotal: '',
    totalCost: ''
  });

  // Sample data for the table
  const bookings = [
    { mobile: '7894561231', checkIn: '22/01/2021', checkOut: '28/02/2021', roomType: 'Double', roomNo: '101', meal: 'Breakfast', noOfDays: '37' },
    { mobile: '7894561231', checkIn: '22/01/2021', checkOut: '28/02/2021', roomType: 'Double', roomNo: '102', meal: 'Breakfast', noOfDays: '37' },
    { mobile: '7894561231', checkIn: '22/01/2021', checkOut: '22/02/2021', roomType: 'Luxury', roomNo: '103', meal: 'Breakfast', noOfDays: '31' },
    { mobile: '9874563211', checkIn: '22/01/2021', checkOut: '28/01/2021', roomType: 'Double', roomNo: '104', meal: 'Breakfast', noOfDays: '6' },
    { mobile: '9854763210', checkIn: '22/01/2021', checkOut: '10/02/2021', roomType: 'Luxury', roomNo: '203', meal: 'Dinner', noOfDays: '19' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleReset = () => {
    setFormData({
      customerPhone: '',
      checkInDate: '',
      checkOutDate: '',
      roomType: 'Single',
      availableRoom: '101',
      meal: 'Breakfast',
      noOfDays: '',
      paidTax: '',
      actualTotal: '',
      totalCost: ''
    });
  };

  return (
    <div className="flex gap-6">
      {/* Left side - Room Booking Form */}
      <div className="w-1/3 bg-white p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Customer Phone No</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="flex-1 border p-1.5 text-sm"
              />
              <button type="button" className="bg-black text-yellow-400 px-3 py-1 text-sm">
                Fetch Data
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm">Check-in Date:</label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Check-out Date:</label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Room Type:</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Available Room:</label>
            <select
              name="availableRoom"
              value={formData.availableRoom}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            >
              <option value="101">101</option>
              <option value="102">102</option>
              <option value="103">103</option>
              <option value="104">104</option>
              <option value="203">203</option>
            </select>
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
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm">Paid Tax:</label>
            <input
              type="text"
              name="paidTax"
              value={formData.paidTax}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Actual Total:</label>
            <input
              type="text"
              name="actualTotal"
              value={formData.actualTotal}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm">Total Cost:</label>
            <input
              type="text"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
              readOnly
            />
          </div>
          <div>
            <button type="button" className="w-full bg-black text-yellow-400 px-4 py-1 text-sm mb-2">
              Bill
            </button>
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-black text-yellow-400 px-4 py-1 text-sm">
              Save
            </button>
            <button type="button" className="bg-black text-yellow-400 px-4 py-1 text-sm">
              Update
            </button>
            <button type="button" className="bg-black text-yellow-400 px-4 py-1 text-sm">
              Delete
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-black text-yellow-400 px-4 py-1 text-sm"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Right side - View Booking Details & Search */}
      <div className="flex-1 bg-white p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">View Customer Details & Search System</h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <span className="bg-red-500 text-white px-2 py-1 text-sm mr-2">Search By</span>
            <select className="border p-1.5 text-sm">
              <option>Select Option</option>
              <option>Mobile</option>
              <option>Room No</option>
            </select>
          </div>
          <input type="text" className="border p-1.5 text-sm flex-1" placeholder="Search..." />
          <button className="bg-green-700 text-white px-4 py-1.5 text-sm">SEARCH</button>
          <button className="bg-green-700 text-white px-4 py-1.5 text-sm">SHOW ALL</button>
        </div>

        <div className="overflow-x-auto">
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
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-1.5">{booking.mobile}</td>
                  <td className="border p-1.5">{booking.checkIn}</td>
                  <td className="border p-1.5">{booking.checkOut}</td>
                  <td className="border p-1.5">{booking.roomType}</td>
                  <td className="border p-1.5">{booking.roomNo}</td>
                  <td className="border p-1.5">{booking.meal}</td>
                  <td className="border p-1.5">{booking.noOfDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 