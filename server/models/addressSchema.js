const mongoose = require('mongoose');

const objectId = mongoose.Schema.ObjectId
const addressSchema = mongoose.Schema({

    userId:{type: objectId, required: true, ref: "users"},
    addressType:{type: String, enum: ["HOME", "WRKSPACE"], required: true},
    name:{type: String, required: true},
    place:{type: String, required: true},
    pincode:{type: Number, required: true},
    state:{type: String, required: true},
    country:{type: String, required: true},
    fullAddress:{type: String, required: true},
    isDeleted: {type: Boolean, required: true, default: false}
},{
    timestamps: true
})

const Address = mongoose.model('address', addressSchema)

module.exports = Address;