const express = require("express");
const {emailExist, verifyOtp,  sentOtp, verifyUser, verifyGoogleUser, relatedProduct, listAllProducts, updateUser, resetPassword} = require("../controllers/user/userController")
const user = express.Router();
const passport = require('passport');
const { listCategory } = require("../controllers/admin/adminControllers");
const { addToCart, cartCount, listCart, updateCount, deleteCartProducts } = require("../controllers/user/cartController");
const { addAddress, listAddress, deleteAddress, addOrder, sendOrderMail, listOrder, cancelOrder, editAddress } = require("../controllers/user/addressController");
const { checkProductAvailability, forgetPasswordOtp } = require("../controllers/user/AuthController");
const { authenticateToken, isBlocked } = require("../Auth/userAuth");
const { verifyToken } = require("../services/jwt");

user.post("/exist", emailExist)

user.post('/generateOtp', sentOtp)
user.post("/verifyOtp", verifyOtp)
user.post("/verifyUser", verifyUser)

user.get('/protected', isBlocked,(req, res)=>{
    res.json()
})

user.put("/user",updateUser)
user.post("/verifyGoogleUser", verifyGoogleUser )


user.get("/relatedProduct", relatedProduct)
user.get('/listAllProducts', listAllProducts)

user.get('/listCategory', listCategory)

user.get('/cart',isBlocked,authenticateToken, listCart)
user.put('/cart', isBlocked, addToCart);
user.patch('/cart', isBlocked, updateCount)
user.delete('/cart', isBlocked, deleteCartProducts)
user.get('/cartCount', isBlocked, cartCount)

user.get('/address', isBlocked, listAddress);
user.patch('/address',isBlocked, editAddress)
user.post("/address", isBlocked, addAddress);
user.delete("/address", isBlocked, deleteAddress)

user.get('/checkProducts', checkProductAvailability) // productAvilable checking


user.post("/order", isBlocked, addOrder)   
user.get('/sendOrderMail', isBlocked, sendOrderMail)
user.get('/order', isBlocked, listOrder)
user.delete("/order", isBlocked, cancelOrder)

user.post('/forgot-password', isBlocked, forgetPasswordOtp);
user.post('/reset-password', isBlocked, resetPassword);

module.exports = user