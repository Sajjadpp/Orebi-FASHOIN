import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { adminAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { formatTimestampToDate } from '../../../services/DateMaker/DateMaker';

const SalesReport = () => {
  const [dateFilter, setDateFilter] = useState('day');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [salesData, setSalesData] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalDiscount: 0,
    orders: [],
  });

  // Fetch sales data from the backend
  const fetchSalesData = async () => {
    try {
      const response = await adminAxiosInstance.get('/sales-report', {
        params: {
          dateFilter,
          customStartDate,
          customEndDate,
        },
      });
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  // Generate report when filter changes
  useEffect(() => {
    fetchSalesData();
  }, [dateFilter, customStartDate, customEndDate]);

  // Download as PDF
  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 20, 10);
    doc.autoTable({
      head: [['Order ID', 'Customer', 'Date', 'Payment Method', 'Discount', 'Total Amount']],
      body: salesData.orders.map(order => [
        order.orderId,
        order.user.username,
        formatTimestampToDate(order.date),
        order.paymentMethod,
        `₹${order.discount ?? 0}`,
        `₹${order.totalAmount.toFixed() ?? 0}`,
      ]),
    });
    doc.save('sales_report.pdf');
  };

  // Download as Excel
  const downloadAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salesData.orders.map(order => ({
      'Order ID': order.orderId,
      'Customer': order.user.username,
      'Date': formatTimestampToDate(order.date),
      'Payment Method': order.paymentMethod,
      'Discount': `₹${order.discount ?? 0}`,
      'Total Amount': `₹${order.totalAmount.toFixed() ?? 0}`,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    XLSX.writeFile(wb, 'sales_report.xlsx');
  };

  // Reusable Download Button Component
  const DownloadButton = ({ onClick, label, color }) => (
    <button
      onClick={onClick}
      className={`bg-${color}-600 text-white px-4 py-2 rounded flex items-center gap-2`}
    >
      <Download size={16} />
      {label}
    </button>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <div className="flex gap-3">
          <DownloadButton onClick={downloadAsPDF} label="PDF" color="blue" />
          <DownloadButton onClick={downloadAsExcel} label="Excel" color="green" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="day">1 Day</option>
              <option value="week">1 Week</option>
              <option value="month">1 Month</option>
              <option value="year">1 Year</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {dateFilter === 'custom' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
            </>
          )}

          <button
            onClick={fetchSalesData}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{salesData.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Sales</h3>
          <p className="text-2xl font-bold">₹{salesData.totalSales}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Discount</h3>
          <p className="text-2xl font-bold">₹{salesData?.totalDiscount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Customer</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Payment Method</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Discount</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salesData.orders.map((order) => (
              <tr key={order.orderId}>
                <td className="px-6 py-4 text-sm">{order.orderId}</td>
                <td className="px-6 py-4 text-sm text-center">{order.user.username}</td>
                <td className="px-6 py-4 text-sm text-center">{formatTimestampToDate(order.date)}</td>
                <td className="px-6 py-4 text-sm text-center">{order.paymentMethod}</td>
                <td className="px-6 py-4 text-sm text-center">₹{order.discount ?? 0}</td>
                <td className="px-6 py-4 text-sm text-center">₹{order.totalAmount.toFixed() ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;