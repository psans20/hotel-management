import React from 'react';

export default function MobileRestriction() {
  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 md:hidden">
      <h1 className="text-2xl font-bold mb-4">This is not viewable on mobile,</h1>
      <p className="text-lg">please switch to desktop to view website</p>
    </div>
  );
} 