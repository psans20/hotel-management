'use client';

import { useState, useEffect } from 'react';

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

export default function DetailsForm() {
  const [formData, setFormData] = useState<CustomerFormData>({
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

  const [searchField, setSearchField] = useState('customerName');
  const [searchText, setSearchText] = useState('');
  const [customers, setCustomers] = useState<CustomerFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Fetch all customers on component mount
  useEffect(() => {
    fetchCustomers();
    
    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchCustomers();
    }, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchCustomers = async (field?: string, value?: string) => {
    setLoading(true);
    setNoResults(false);
    try {
      let url = '/api/customers/filter';
      if (field && value) {
        url += `?field=${field}&value=${value}`;
      }
      // Add timestamp to prevent caching
      url += (url.includes('?') ? '&' : '?') + `_t=${Date.now()}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error('Failed to fetch customers');
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

  return (
    <div className="flex gap-6">
      {/* Left side - Customer Details Form */}
      <div className="w-1/3 bg-white p-4 border rounded">
        <h2 className="text-lg font-semibold mb-4">Add Customer Details</h2>
        <form className="space-y-3">
          <div>
            <label className="block text-sm">Customer Ref</label>
            <input type="text" className="border p-1.5 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm">Customer Name</label>
            <input type="text" className="border p-1.5 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm">Mother Name</label>
            <input type="text" className="border p-1.5 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm">Gender</label>
            <select className="border p-1.5 w-full text-sm">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">PostCode</label>
            <input type="text" className="border p-1.5 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm">Mobile</label>
            <input type="text" className="border p-1.5 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input type="email" className="border p-1.5 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm">Nationality</label>
            <select className="border p-1.5 w-full text-sm">
              <option>Indian</option>
              <option>American</option>
              <option>British</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">ID Proof Type</label>
            <select className="border p-1.5 w-full text-sm">
              <option>AdharCard</option>
              <option>Passport</option>
              <option>Driving License</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">ID Number</label>
            <input type="text" className="border p-1.5 w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <textarea className="border p-1.5 w-full text-sm" rows={3}></textarea>
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
            <button type="button" className="bg-black text-yellow-400 px-4 py-1 text-sm">
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
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="border p-1.5 text-sm"
            >
              <option value="customerName">Name</option>
              <option value="customerRef">Reference</option>
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
            <div>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => fetchCustomers()}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Refresh Table
                </button>
              </div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 