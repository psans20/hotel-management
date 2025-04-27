'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Time from './components/Time';
import Sidebar from './components/Sidebar';
import CustomerForm from './components/CustomerForm';
import BookingForm from './components/BookingForm';
import CustomerStats from './components/CustomerStats';
import BookingStats from './components/BookingStats';

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('Dashboard');

  const renderContent = () => {
    switch (selectedItem) {
      case 'Customer':
        return <CustomerForm />;
      case 'Booking':
        return <BookingForm />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="bg-white p-6 rounded-lg shadow-md transition-colors duration-300 hover:bg-blue-600 group cursor-pointer"
                  onClick={() => setSelectedItem('Customer')}
                >
                  <h2 className="text-xl font-semibold mb-4 group-hover:text-white">Customer Management</h2>
                  <p className="text-gray-600 group-hover:text-white">Manage customer information and details</p>
                </div>
                <div 
                  className="bg-white p-6 rounded-lg shadow-md transition-colors duration-300 hover:bg-blue-600 group cursor-pointer"
                  onClick={() => setSelectedItem('Booking')}
                >
                  <h2 className="text-xl font-semibold mb-4 group-hover:text-white">Booking System</h2>
                  <p className="text-gray-600 group-hover:text-white">Handle room bookings and reservations</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomerStats />
                <BookingStats />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Time />
      <div className="flex">
        <Sidebar onSelectItem={setSelectedItem} selectedItem={selectedItem} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Hotel Management System</h1>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
