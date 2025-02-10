import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SalesCategories = () => {
  const categoryData = [
    { name: 'shirt', value: 19, percentage: '57.6' },
    { name: 'hoodies', value: 12, percentage: '36.4' },
    { name: 'casual shoe', value: 2, percentage: '6.1' }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Top Product Categories
      </h3>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={200}
              fill="#8884d8"
              paddingAngle={1}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, entry) => [
                `${value} (${entry.payload.percentage}%)`,
                name
              ]}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span className="text-sm text-gray-600">
                  {value} - {entry.payload.percentage}%
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {categoryData.map((item, index) => (
          <div key={item.name} className="text-center">
            <div className="text-sm font-medium" style={{ color: COLORS[index] }}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </div>
            <div className="text-gray-600">
              {item.value} ({item.percentage}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesCategories;