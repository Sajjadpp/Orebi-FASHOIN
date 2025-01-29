import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminAxiosInstance } from '../../../redux/constants/AxiosInstance';

import StatusCard from '../../../components/admin/Dashboard/StatusCardRow/StatusCard';
import SalesStatistics from '../../../components/admin/Dashboard/Chart/SalesStatistics';
import RevenueArea from '../../../components/admin/Dashboard/Chart/RevenueArea';
import NewOrders from '../../../components/admin/Dashboard/OrcersAndMembers/NewOrders';
import NewMember from '../../../components/admin/Dashboard/OrcersAndMembers/NewMembers';

const Dashboard = () => {
  const admin = useSelector(state => state.adminReducer.token);
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState([]);
  const [topCategory, setTopCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month'); // default to month

  const getStartDate = (range) => {
    const now = new Date();
    switch (range) {
      case 'day':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        const week = new Date(now);
        week.setDate(week.getDate() - 7);
        return week;
      case 'month':
        const month = new Date(now);
        month.setMonth(month.getMonth() - 1);
        return month;
      case 'year':
        const year = new Date(now);
        year.setFullYear(year.getFullYear() - 1);
        return year;
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  };

  const fetchData = async (selectedRange = timeRange) => {
    setIsLoading(true);
    try {
      const response = await adminAxiosInstance.get('/top-category', {
        params: {
          startDate: getStartDate(selectedRange).toISOString()
        }
      });
      console.log(response)
      // Transform products data
      const transformedProductData = response.data.bestProducts.map(product => ({
        name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
        fullName: product.name,
        value: product.value
      }));

      // Transform category data
      const transformedCategoryData = response.data.topCategories.map(category => ({
        name: category.name.length > 20 ? category.name.substring(0, 20) + '...' : category.name,
        fullName: category.name,
        value: category.value
      }));

      setTopProducts(transformedProductData);
      setTopCategory(transformedCategoryData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (!admin) return navigate("/admin/login");
    }, 1000);
  }, [admin]);

  useEffect(() => {
    if (admin) {
      fetchData();
    }
  }, [admin]);

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header with Create Report Button and Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                fetchData(e.target.value);
              }}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={() => fetchData(timeRange)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="h-5 w-5" />
            Create Report
          </button>
        </div>
      </div>

      <StatusCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesStatistics topCategory={topCategory} />
        <RevenueArea topProducts={topProducts} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewOrders />
        <NewMember />
      </div>
    </div>
  );
};

export default Dashboard;