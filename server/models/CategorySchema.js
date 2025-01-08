const mongoose = require("mongoose");

let ObjectId = mongoose.Schema.ObjectId
const categorySchema = new mongoose.Schema({
    name:{required: true, type: String},
    parentCategory:{default: null, required: false, type: ObjectId },   
    type:{required: true, type: String,},
    description:{required: true, type: String},
    isActive: {type: Boolean, required:true, default: true}
},{
    timestamps: true
})

let model = mongoose.model("category", categorySchema)

module.exports = model;
