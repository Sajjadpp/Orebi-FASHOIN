const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/ordersSchema'); // Assuming you have an Order model
const Category = require('../../models/CategorySchema')
const Product= require('../../models/ProductSchema')

// Fetch sales report
const getSalesReport = async (req, res) => {
    console.log('Generating sales report...');
    try {
      const { dateFilter, customStartDate, customEndDate } = req.query;
  
      // Determine the date range based on the filter
      let startDate, endDate;
      const today = new Date();
  
      switch (dateFilter) {
        case 'day':
          startDate = new Date(today.setHours(0, 0, 0, 0));
          endDate = new Date(today.setHours(23, 59, 59, 999));
          break;
        case 'week':
          startDate = new Date(today.setDate(today.getDate() - 7));
          endDate = new Date();
          break;
        case 'month':
          startDate = new Date(today.setMonth(today.getMonth() - 1));
          endDate = new Date();
          break;
        case 'year':
          startDate = new Date(today.setFullYear(today.getFullYear() - 1));
          endDate = new Date();
          break;
        case 'custom':
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          break;
        default:
          return res.status(400).json({ error: 'Invalid date filter' });
      }
  
      // Query only eligible orders
      const orders = await Order.find({
        paymentStatus: 'success', // Include paid or payable orders
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
       
      }).populate('userId');
  
      // Calculate totals
      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0); // Total revenue
      const totalDiscount = orders.reduce((sum, order) => sum + order.discountApplied, 0); // Total discount
  
      // Response data
      res.json({
        totalOrders,
        totalSales,
        totalDiscount,
        orders: orders.map((order) => ({
          user: order.userId, // Populated user details
          orderId: order._id,
          customer: order.customerName, // Assuming customerName field exists
          date: order.createdAt,
          paymentMethod: order.paymentMethod,
          discount: order.discountApplied,
          totalAmount: order.totalAmount
        })),
      });
    } catch (error) {
      console.error('Error generating sales report:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getTopCategoriesAndProducts = async(req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get all completed orders
    const orders = await Order.find({
      orderStatus: { $ne: "pending" },
      ...(startDate && { createdAt: { $gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { $lte: new Date(endDate) } })
    }).exec();

    // Initialize counters
    const productCount = {};
    const categoryCount = {};

    // Process orders to count products
    orders.forEach(order => {
      order.items.forEach((item) => {
        // Count products
        let count = item.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
        if (item.productId in productCount) {
          productCount[item.productId] += count;
        } else {
          productCount[item.productId] = count;
        }
      });
    });

    // Get product details
    const productIds = Object.keys(productCount);
    const products = await Product.find(
      { _id: { $in: productIds } },
      { name: 1, category: 1 }
    );

    // Process products to count categories using category names
    products.forEach(product => {
      const count = productCount[product._id];
      const categoryName = product.category; // Using category name directly
      if (categoryName in categoryCount) {
        categoryCount[categoryName] += count;
      } else {
        categoryCount[categoryName] = count;
      }
    });

    // Format product results
    let bestProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      value: productCount[product._id],
    }));

    // Format category results using the names directly
    let topCategories = Object.entries(categoryCount).map(([categoryName, value]) => ({
      name: categoryName,
      value: value,
    }));

    // Sort both arrays by value in descending order and limit to top 4
    bestProducts.sort((a, b) => b.value - a.value);
    topCategories.sort((a, b) => b.value - a.value);

    bestProducts = bestProducts.slice(0, 4);
    topCategories = topCategories.slice(0, 4);

    // Add percentage calculations
    const totalProductSales = bestProducts.reduce((sum, product) => sum + product.value, 0);
    const totalCategorySales = topCategories.reduce((sum, category) => sum + category.value, 0);

    bestProducts = bestProducts.map(product => ({
      ...product,
      percentage: ((product.value / totalProductSales) * 100).toFixed(1)
    }));

    topCategories = topCategories.map(category => ({
      ...category,
      percentage: ((category.value / totalCategorySales) * 100).toFixed(1)
    }));

    // Calculate summary statistics
    const summary = {
      totalOrders: orders.length,
      totalProductsSold: totalProductSales,
      totalCategories: Object.keys(categoryCount).length,
      dateRange: {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null
      }
    };

    res.json({
      success: true,
      bestProducts,
      topCategories,
      summary
    });

  } catch(error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top categories and products',
      error: error.message
    });
  }
};



module.exports = {
    getSalesReport,
    getTopCategoriesAndProducts
};
