const mongoose = require('mongoose');

const objectId = mongoose.Schema.ObjectId

const cartSchema = mongoose.Schema({

    userId:{type: objectId, required: true},
    cartItems:[
        {
            productId:{type: objectId, required: true, ref: "product"},
            stocks:[{
                size:{type: String, required: true},
                quantity:{type: Number, required: true, default: 1}
            }]
        }
    ]   
},
{
    timeStamps: true
})


const Cart = mongoose.model("cart", cartSchema)

module.exports = Cart