'use client';

import { useState } from 'react';

export default function DetailsForm() {
  const [formData, setFormData] = useState({
    customerRef: '',
    customerName: '',
    motherName: '',
    gender: 'Male',
    postCode: '',
    mobile: '',
    email: '',
    nationality: 'Indian',
    idProofType: 'AdharCard',
    idNumber: '',
    address: ''
  });

  // Sample data for the table
  const customers = [
    { refNo: '3926', name: 'Meena', motherName: 'Minakshi', gender: 'Female', postCode: '216950', mobile: '9874563211', email: 'meena@123', nationality: 'Indian' },
    { refNo: '5071', name: 'Smith', motherName: 'Sri', gender: 'Male', postCode: '2215487', mobile: '7896542310', email: 'smith@gmail.yah', nationality: 'American' },
    { refNo: '6061', name: 'Sonali', motherName: 'Mohini', gender: 'Female', postCode: '326598', mobile: '8974563210', email: 'sona@123', nationality: 'Indian' },
    { refNo: '7627', name: 'Kiran', motherName: 'Nirmala', gender: 'Male', postCode: '875421', mobile: '7894561231', email: 'kiran@123', nationality: 'Indian' },
    { refNo: '7688', name: 'Robert', motherName: 'Sophia', gender: 'Male', postCode: '879654', mobile: '9854763210', email: 'robert@gmail.com', nationality: 'British' }
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
      customerRef: '',
      customerName: '',
      motherName: '',
      gender: 'Male',
      postCode: '',
      mobile: '',
      email: '',
      nationality: 'Indian',
      idProofType: 'AdharCard',
      idNumber: '',
      address: ''
    });
  };

  return (
    <div className="flex gap-6">
      {/* Left side - Customer Details Form */}
      <div className="w-1/3 bg-white p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">Add Customer Details</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Customer Ref</label>
            <input
              type="text"
              name="customerRef"
              value={formData.customerRef}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Mother Name</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">PostCode</label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            >
              <option value="Indian">Indian</option>
              <option value="American">American</option>
              <option value="British">British</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Id Proof Type</label>
            <select
              name="idProofType"
              value={formData.idProofType}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            >
              <option value="AdharCard">AdharCard</option>
              <option value="Passport">Passport</option>
              <option value="DrivingLicence">Driving Licence</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Id Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-1.5 text-sm"
            />
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

      {/* Right side - View Customer Details & Search */}
      <div className="flex-1 bg-white p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">View Customer Details & Search</h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <span className="bg-red-500 text-white px-2 py-1 text-sm mr-2">Search By</span>
            <select className="border p-1.5 text-sm">
              <option>Select Option</option>
              <option>Name</option>
              <option>Reference</option>
              <option>Mobile</option>
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
                <th className="border p-1.5 text-left">Refer No</th>
                <th className="border p-1.5 text-left">Name</th>
                <th className="border p-1.5 text-left">Mother Name</th>
                <th className="border p-1.5 text-left">Gender</th>
                <th className="border p-1.5 text-left">PostCode</th>
                <th className="border p-1.5 text-left">Mobile</th>
                <th className="border p-1.5 text-left">Email</th>
                <th className="border p-1.5 text-left">Nationality</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.refNo} className="hover:bg-gray-50">
                  <td className="border p-1.5">{customer.refNo}</td>
                  <td className="border p-1.5">{customer.name}</td>
                  <td className="border p-1.5">{customer.motherName}</td>
                  <td className="border p-1.5">{customer.gender}</td>
                  <td className="border p-1.5">{customer.postCode}</td>
                  <td className="border p-1.5">{customer.mobile}</td>
                  <td className="border p-1.5">{customer.email}</td>
                  <td className="border p-1.5">{customer.nationality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 