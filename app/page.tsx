'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Time from './components/Time';
import Sidebar from './components/Sidebar';
import CustomerForm from './components/CustomerForm';
import BookingForm from './components/BookingForm';
import DetailsForm from './components/DetailsForm';

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('Dashboard');

  const renderContent = () => {
    switch (selectedItem) {
      case 'Customer':
        return <CustomerForm />;
      case 'Booking':
        return <BookingForm />;
      case 'Details':
        return <DetailsForm />;
      default:
        return <h1 className="text-3xl font-bold mb-6">{selectedItem}</h1>;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Time />
      <div className="flex">
        <Sidebar onSelectItem={setSelectedItem} />
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
