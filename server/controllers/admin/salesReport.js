const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/ordersSchema'); // Assuming you have an Order model

// Fetch sales report
const getSalesReport = async (req, res) => {

    console.log('working resoinse')
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

    // Query orders within the date range
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("userId");

    // Calculate totals
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0); // Assuming totalAmount field
    const totalDiscount = orders.reduce((sum, order) => sum + order.discount, 0); // Assuming discount field

    // Response data
    res.json({
      totalOrders,
      totalSales,
      totalDiscount,
      orders: orders.map((order) => ({
        user:order.userId,
        orderId: order._id,
        customer: order.customerName, // Assuming customerName field
        date: order.createdAt,
        paymentMethod: order.paymentMethod,
        discount: order.discount,
      })),
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
    getSalesReport
};
