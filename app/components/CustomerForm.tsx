'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { originalMockCustomers } from '../data/originalMockData';
import { useCustomerStore } from '../store/customerStore';

interface CustomerFormData {
  id?: number;
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
}

export default function CustomerForm() {
  const { updateCustomer } = useCustomerStore();

  const [formData, setFormData] = useState<CustomerFormData>({
    customerRef: '',
    customerName: '',
    motherName: '',
    gender: 'Male',
    postCode: '',
    mobile: '',
    email: '',
    nationality: 'American',
    idProofType: 'DrivingLicence',
    idNumber: '',
    address: ''
  });

  const [searchField, setSearchField] = useState('customerName');
  const [searchText, setSearchText] = useState('');
  const [customers, setCustomers] = useState<CustomerFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');

  // Fetch all customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (field?: string, value?: string) => {
    setLoading(true);
    setNoResults(false);
    try {
      let url = '/api/customers';
      if (field && value) {
        url = `/api/customers/filter?field=${field}&value=${value}`;
      }
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch customers');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (Array.isArray(data)) {
        setCustomers(data);
        setNoResults(data.length === 0);
      } else {
        console.error('Unexpected data format:', data);
        setCustomers([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Search clicked with:', { searchField, searchText });
    if (!searchText.trim()) {
      console.log('Empty search, showing all customers');
      await fetchCustomers();
      return;
    }
    console.log('Searching for customers with:', { searchField, searchText });
    await fetchCustomers(searchField, searchText);
  };

  const handleShowAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchText('');
    setNoResults(false);
    await fetchCustomers();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate required fields
      const requiredFields = ['customerName', 'gender', 'mobile', 'email'] as const;
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setModalTitle('Error');
        setModalMessage(`Please fill in required fields: ${missingFields.join(', ')}`);
        setModalType('error');
        setModalOpen(true);
        return;
      }
      
      // Generate a customer reference if not provided
      const customerData = {
        ...formData,
        customerRef: formData.customerRef || `CUST-${Math.floor(1000 + Math.random() * 9000)}`
      };
      
      console.log('Sending customer data:', customerData);
      
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      // Check if we have a successful response
      if (response.ok && result.customer) {
        console.log('Customer created successfully:', result.customer);
        
        // Update the store with the new customer
        updateCustomer(result.customer);
        
        // Update the customers list to reflect the change immediately
        setCustomers(prevCustomers => [...prevCustomers, result.customer]);
        
        // Reset form after successful save
        handleReset();
        
        // Show success modal
        setModalTitle('Success');
        setModalMessage('Customer has been added successfully!');
        setModalType('success');
        setModalOpen(true);
        
        // Refresh the customer list to ensure we have the latest data
        await fetchCustomers();
      } else {
        console.error('Failed response:', result);
        throw new Error(result.error || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Error in customer creation:', error);
      
      // Show error modal
      setModalTitle('Error');
      setModalMessage(error instanceof Error ? error.message : 'Failed to save customer. Please try again.');
      setModalType('error');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
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
      nationality: 'American',
      idProofType: 'DrivingLicence',
      idNumber: '',
      address: ''
    });
  };

  const handleDelete = async () => {
    if (!formData.customerRef) {
      setModalTitle('Error');
      setModalMessage('Please select a customer to delete');
      setModalType('error');
      setModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      const encodedCustomerRef = encodeURIComponent(formData.customerRef.trim());
      console.log('Attempting to delete customer with ref:', formData.customerRef);
      
      const response = await fetch(`/api/customers/${encodedCustomerRef}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete customer');
      }

      // Reset form and refresh customer list immediately
      handleReset();
      await fetchCustomers();

      // Show success modal
      setModalTitle('Success');
      setModalMessage('Customer has been deleted successfully!');
      setModalType('success');
      setModalOpen(true);
    } catch (error) {
      console.error('Error deleting customer:', error);
      setModalTitle('Error');
      setModalMessage(error instanceof Error ? error.message : 'Failed to delete customer. Please try again.');
      setModalType('error');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.customerRef) {
      setModalTitle('Error');
      setModalMessage('No customer selected for update');
      setModalType('error');
      setModalOpen(true);
      return;
    }

    // Validate required fields
    const requiredFields = ['customerName', 'gender', 'mobile', 'email'] as const;
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setModalTitle('Error');
      setModalMessage(`Please fill in required fields: ${missingFields.join(', ')}`);
      setModalType('error');
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      // Log the form data being sent
      console.log('Sending update request with data:', {
        ...formData,
        customerRef: formData.customerRef.trim()
      });
      
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customerRef: formData.customerRef.trim() // Ensure no whitespace in reference
        }),
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.details || 'Failed to update customer';
        console.error('Update failed:', errorMessage);
        throw new Error(errorMessage);
      }

      // Update the form data with the returned customer data
      if (data.customer) {
        console.log('Setting updated customer data:', data.customer);
        setFormData(data.customer);
        
        // Update the customers list to reflect the change immediately
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer.customerRef === data.customer.customerRef ? data.customer : customer
          )
        );

        // Update the store with the new customer data
        updateCustomer(data.customer);
      }

      // Refresh the customer list to ensure we have the latest data
      await fetchCustomers();

      setModalTitle('Success');
      setModalMessage('Customer updated successfully');
      setModalType('success');
      setModalOpen(true);

      // Add a small delay and refresh again to ensure data consistency
      setTimeout(async () => {
        await fetchCustomers();
      }, 1000);
    } catch (error) {
      console.error('Error updating customer:', error);
      setModalTitle('Error');
      setModalMessage(error instanceof Error ? error.message : 'Failed to update customer');
      setModalType('error');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Left side - Customer Details Form */}
      <div className="w-1/3 bg-white p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Customer Ref</label>
            <input
              type="text"
              name="customerRef"
              value={formData.customerRef}
              onChange={handleChange}
              readOnly
              className="w-full border p-1.5 text-sm bg-gray-100"
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
              <option value="American">American</option>
              <option value="British">British</option>
              <option value="Indian">Indian</option>
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
              <option value="DrivingLicence">Driving Licence</option>
              <option value="Passport">Passport</option>
              <option value="NationalID">National ID</option>
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
          <div className="flex space-x-2 pt-2">
            <button 
              type="submit" 
              className="bg-black text-yellow-400 px-4 py-1 text-sm"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button 
              type="button" 
              className="bg-black text-yellow-400 px-4 py-1 text-sm"
              onClick={handleUpdate}
              disabled={loading}
            >
              Update
            </button>
            <button 
              type="button" 
              className="bg-black text-yellow-400 px-4 py-1 text-sm"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
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
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="border p-1.5 text-sm"
            >
              <option value="customerName">Name</option>
              <option value="customerRef">Reference</option>
              <option value="motherName">Mother Name</option>
              <option value="postCode">Post Code</option>
              <option value="mobile">Mobile</option>
              <option value="email">Email</option>
            </select>
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="border p-1.5 text-sm flex-1"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-700 text-white px-4 py-1.5 text-sm"
          >
            {loading ? 'Searching...' : 'SEARCH'}
          </button>
          <button
            onClick={handleShowAll}
            disabled={loading}
            className="bg-green-700 text-white px-4 py-1.5 text-sm"
          >
            SHOW ALL
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : noResults ? (
            <div className="text-center py-4 text-gray-500">No matching records found</div>
          ) : (
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
                  <th className="border p-1.5 text-left">Address</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr 
                    key={customer.customerRef} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setFormData({
                        customerRef: customer.customerRef,
                        customerName: customer.customerName,
                        motherName: customer.motherName,
                        gender: customer.gender,
                        postCode: customer.postCode,
                        mobile: customer.mobile,
                        email: customer.email,
                        nationality: customer.nationality,
                        idProofType: customer.idProofType,
                        idNumber: customer.idNumber,
                        address: customer.address
                      });
                    }}
                  >
                    <td className="border p-1.5">{customer.customerRef}</td>
                    <td className="border p-1.5">{customer.customerName}</td>
                    <td className="border p-1.5">{customer.motherName}</td>
                    <td className="border p-1.5">{customer.gender}</td>
                    <td className="border p-1.5">{customer.postCode}</td>
                    <td className="border p-1.5">{customer.mobile}</td>
                    <td className="border p-1.5">{customer.email}</td>
                    <td className="border p-1.5">{customer.nationality}</td>
                    <td className="border p-1.5">{customer.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
} 