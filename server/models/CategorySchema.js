const mongoose = require("mongoose");

let ObjectId = mongoose.Schema.ObjectId
const UserSchema = new mongoose.Schema({
    name:{required: true, type: String},
    parentCategory:{default: null, required: false, type: ObjectId },   
    type:{required: true, type: String,},
    description:{required: true, type: String}
},{
    timestamps: true
})

let model = mongoose.model("category", UserSchema)

module.exports = model;
