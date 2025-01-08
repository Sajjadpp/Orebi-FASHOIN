const mongoose = require("mongoose");

let ObjectId = mongoose.Schema.ObjectId;

const whishlist = new mongoose.Schema({
    userId:{required: true, type: ObjectId},
    products:{required: true, type: [{
        type: ObjectId,
        ref: 'product'
    }]}
},{
    timestamps: true
})

let model = mongoose.model("wishList", whishlist)

module.exports = model;
