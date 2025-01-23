const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  applicableType: {
    type: String,
    enum: ['product', 'category'], // Offer applies to either 'product' or 'category'
    required: true,
  },
  applicableId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'applicableType', // Dynamically references either 'Product' or 'Category'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
