const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username: {required: true, type: String},
    email: { required: true, type: String},
    password: { required: false, default: null, type: String},
    mobileNo: { required: true, default: "null", type: String},
    googleId: { default: null, type: String},
    status: {default: true, type: Boolean, required:true},
    profile: {default:null, type: String}
},{
    timestamps: true
})

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel