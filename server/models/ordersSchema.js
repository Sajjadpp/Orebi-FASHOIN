const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.ObjectId

let ordersSchema = mongoose.Schema({

    userId:{type: ObjectId, required: true},
    items:[{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        stocks:[{
            quantity: { type: Number, required: true },
            size: { type: String },
        }],
        price:{required: true, type: Number},
        total:{required: true, type: Number},
        status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Returned', 'Cancelled' ,'return-request' ,'cancel-request'], default: 'Pending' }

    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    paymentMethod: { type: String, enum: ['razorpay', 'cod' , 'wallet'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'Shipped', 'Delivered', 'Returned', 'Cancelled' ,'return-request' ,'cancel-request'],
      default: 'pending',
    },

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