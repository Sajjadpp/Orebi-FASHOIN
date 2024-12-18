const express = require("express");
const {emailExist, verifyOtp,  sentOtp, verifyUser, verifyGoogleUser} = require("../controllers/userController")
const user = express.Router();
const passport = require('passport')

user.post("/exist", emailExist)

user.post('/generateOtp', sentOtp)

user.post("/verifyOtp", verifyOtp)

user.post("/verifyUser", verifyUser)


user.post("/verifyGoogleUser", verifyGoogleUser )







module.exports = user