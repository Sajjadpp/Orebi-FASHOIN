const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.ObjectId

let ordersSchema = mongoose.Schema({
    _id: {required: true, type: String, },
    userId:{type: ObjectId, required: true, ref:"user"},
    items:[{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        stocks:[{
            quantity: { type: Number, required: true },
            size: { type: String },
        }],
        price:{required: true, type: Number},
        total:{required: true, type: Number},
        status: { type: String, enum: ['Pending', 'Shipped','Out for delivery', 'Delivered', 'Returned', 'Cancelled' ,'return-request' ,'cancel-request'], default: 'Pending' }

    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    paymentMethod: { type: String, enum: ['razorpay', 'cod' , 'wallet'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'Shipped', 'Out for delivery', 'Delivered', 'Returned', 'Cancelled' ,'return-request' ,'cancel-request'],
      default: 'pending',
    },
    discountApplied:{type: Number, required: true},
    shippingCharge:{type: Number, required: true},
},{
    timestamps: true
})

// Enable virtual populate
ordersSchema.virtual('productDetails', {
    ref: 'product', // The model to use
    localField: 'items.productId', // Match this field
    foreignField: '_id', // With this field from Product
});
  
  // Ensure virtual fields are serialized
ordersSchema.set('toJSON', { virtuals: true });
ordersSchema.set('toObject', { virtuals: true });

const model = mongoose.model("order", ordersSchema)

module.exports = model