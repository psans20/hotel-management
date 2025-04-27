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

export default function BookingStats() {
  const [bookingData, setBookingData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    roomTypeData: {},
    revenueByRoomType: {},
  });

  useEffect(() => {
    fetchBookingStats();
  }, []);

  const fetchBookingStats = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch booking data');
      const bookings = await response.json();

      // Process data for charts
      const roomTypeCount: { [key: string]: number } = {};
      const revenueByRoomType: { [key: string]: number } = {};
      let totalRevenue = 0;

      bookings.forEach((booking: any) => {
        // Count room types
        roomTypeCount[booking.roomType] = (roomTypeCount[booking.roomType] || 0) + 1;
        
        // Calculate revenue
        const revenue = parseFloat(booking.totalCost) || 0;
        totalRevenue += revenue;
        revenueByRoomType[booking.roomType] = (revenueByRoomType[booking.roomType] || 0) + revenue;
      });

      setBookingData({
        totalBookings: bookings.length,
        totalRevenue,
        roomTypeData: roomTypeCount,
        revenueByRoomType,
      });
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const roomTypeChartData = {
    labels: Object.keys(bookingData.roomTypeData),
    datasets: [
      {
        label: 'Bookings by Room Type',
        data: Object.values(bookingData.roomTypeData),
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

  const revenueChartData = {
    labels: Object.keys(bookingData.revenueByRoomType),
    datasets: [
      {
        label: 'Revenue by Room Type',
        data: Object.values(bookingData.revenueByRoomType),
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
          },
          callback: function(value: any) {
            return '£' + value.toLocaleString();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Booking Statistics</h2>
      <div className="mb-3">
        <p className="text-lg font-medium">Total Bookings: {bookingData.totalBookings}</p>
        <p className="text-lg font-medium">Total Revenue: {formatCurrency(bookingData.totalRevenue)}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64">
          <h3 className="text-lg font-medium mb-2">Bookings by Room Type</h3>
          <Bar data={roomTypeChartData} options={chartOptions} />
        </div>
        <div className="h-64">
          <h3 className="text-lg font-medium mb-2">Revenue by Room Type</h3>
          <Bar data={revenueChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
} 