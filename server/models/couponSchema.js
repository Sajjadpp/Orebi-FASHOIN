const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'], // Can be a percentage or a fixed discount
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  minimumOrderValue: {
    type: Number, // Minimum order value required to use the coupon
    default: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number, // Maximum number of times the coupon can be used
    default: 1,
  },
  usedCount: {
    type: Number, // Tracks how many times the coupon has been used
    default: 0,
  },
  status: {
    type: Boolean, // Indicates if the coupon is active or not
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
