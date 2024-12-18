const mongoose = require("mongoose");



const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    currentPrice:{
        type: String,
        required: true,
    },
    regularPrice:{
        type: String,
        required: true,
    },
    images:{
        type: [String],
        required: true,
    },
    stock:{
        type:[{}],
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },

    
},{
    timestamps: true
})

const model = mongoose.model("product",productSchema)

module.exports = model