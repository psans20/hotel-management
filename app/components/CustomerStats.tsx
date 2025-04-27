'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function CustomerStats() {
  const [customerData, setCustomerData] = useState({
    totalCustomers: 0,
    nationalityData: {},
    genderData: {},
  });

  useEffect(() => {
    fetchCustomerStats();
  }, []);

  const fetchCustomerStats = async () => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customer data');
      const customers = await response.json();

      // Process data for charts
      const nationalityCount: { [key: string]: number } = {};
      const genderCount: { [key: string]: number } = {};

      customers.forEach((customer: any) => {
        // Count nationalities
        nationalityCount[customer.nationality] = (nationalityCount[customer.nationality] || 0) + 1;
        // Count genders
        genderCount[customer.gender] = (genderCount[customer.gender] || 0) + 1;
      });

      setCustomerData({
        totalCustomers: customers.length,
        nationalityData: nationalityCount,
        genderData: genderCount,
      });
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    }
  };

  const nationalityChartData = {
    labels: Object.keys(customerData.nationalityData),
    datasets: [
      {
        label: 'Customers by Nationality',
        data: Object.values(customerData.nationalityData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const genderChartData = {
    labels: Object.keys(customerData.genderData),
    datasets: [
      {
        label: 'Customers by Gender',
        data: Object.values(customerData.genderData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Customer Statistics</h2>
      <div className="mb-3">
        <p className="text-lg font-medium">Total Customers: {customerData.totalCustomers}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64">
          <h3 className="text-lg font-medium mb-2">Customers by Nationality</h3>
          <Bar data={nationalityChartData} options={chartOptions} />
        </div>
        <div className="h-64">
          <h3 className="text-lg font-medium mb-2">Customers by Gender</h3>
          <Doughnut data={genderChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
} 