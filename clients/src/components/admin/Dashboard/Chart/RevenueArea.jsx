import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAxiosInstance } from '../../../../redux/constants/AxiosInstance';

const TopProducts = ({topProducts:data}) => {
  const [topProducts, setTopProducts] = useState([]);

  

  useEffect(() => {
    setTopProducts(data)
  }, [data]);

  // Custom tooltip to show full product name
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg border rounded-lg">
          <p className="text-sm font-medium text-gray-900">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-600">
            Sales: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProducts}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#64748b"
              tickFormatter={(value) => Math.round(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              name="Sales"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Summary below chart */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {topProducts.map((product, index) => (
          <div 
            key={product._id} 
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <span className="text-sm text-gray-600 truncate" title={product.fullName}>
              {index + 1}. {product.name}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {product.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;