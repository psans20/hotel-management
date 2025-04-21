import React from 'react';

interface CustomerDetailsProps {
  customer: {
    customerRef: string;
    customerName: string;
    motherName: string;
    gender: string;
    postCode: string;
    mobile: string;
    email: string;
    nationality: string;
    idProofType: string;
    idNumber: string;
    address: string;
  };
}

export default function CustomerDetails({ customer }: CustomerDetailsProps) {
  return (
    <div className="bg-gray-50 p-4 border rounded mb-4">
      <h3 className="text-md font-semibold mb-2">Customer Information</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Name:</span> {customer.customerName}
        </div>
        <div>
          <span className="font-medium">Mother's Name:</span> {customer.motherName}
        </div>
        <div>
          <span className="font-medium">Gender:</span> {customer.gender}
        </div>
        <div>
          <span className="font-medium">Post Code:</span> {customer.postCode}
        </div>
        <div>
          <span className="font-medium">Email:</span> {customer.email}
        </div>
        <div>
          <span className="font-medium">Nationality:</span> {customer.nationality}
        </div>
        <div>
          <span className="font-medium">ID Proof:</span> {customer.idProofType}
        </div>
        <div>
          <span className="font-medium">ID Number:</span> {customer.idNumber}
        </div>
        <div className="col-span-2">
          <span className="font-medium">Address:</span> {customer.address}
        </div>
      </div>
    </div>
  );
} 