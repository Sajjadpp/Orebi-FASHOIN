const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    email:{required: true, type: String},
    password: {required: true, type:String}
})


const adminModel = mongoose.model("admin", AdminSchema);

module.exports = adminModel