const express = require("express");
const {emailExist, verifyOtp,  sentOtp, verifyUser, verifyGoogleUser, relatedProduct, listAllProducts} = require("../controllers/userController")
const user = express.Router();
const passport = require('passport');
const { listCategory } = require("../controllers/adminControllers");

user.post("/exist", emailExist)

user.post('/generateOtp', sentOtp)

user.post("/verifyOtp", verifyOtp)

user.post("/verifyUser", verifyUser)


user.post("/verifyGoogleUser", verifyGoogleUser )


user.get("/relatedProduct", relatedProduct)

user.get('/listAllProducts', listAllProducts)

user.get('/listCategory', listCategory)



module.exports = user