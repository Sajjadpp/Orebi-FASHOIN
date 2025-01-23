const express = require("express");
const {emailExist, verifyOtp,  sentOtp, verifyUser, verifyGoogleUser, relatedProduct, listAllProducts, updateUser, resetPassword, listProfileThings, listProductByFilter} = require("../controllers/user/userController")
const user = express.Router();
const passport = require('passport');
const { listCategory } = require("../controllers/admin/adminControllers");
const { addToCart, cartCount, listCart, updateCount, deleteCartProducts, listWishlist, addWishList, removeWishList } = require("../controllers/user/cartController");
const { addAddress, listAddress, deleteAddress, sendOrderMail, listOrder, editAddress, singleAddress } = require("../controllers/user/addressController");
const { checkProductAvailability, forgetPasswordOtp } = require("../controllers/user/AuthController");
const { authenticateToken, isBlocked } = require("../Auth/userAuth");
const { verifyToken } = require("../services/jwt");
const { razorpayToken, editOrder, cancelOrder, getWallet, addOrder } = require("../controllers/user/OrderController");
const { checkApplyCode, getCoupons } = require("../controllers/user/offerAndCouponController");

user.post("/exist", emailExist)

user.post('/generateOtp', sentOtp)
user.post("/verifyOtp", verifyOtp)
user.post("/verifyUser", verifyUser)

user.get('/protected', isBlocked,(req, res)=>{
    res.json()
})

user.put("/user",updateUser)
user.post("/verifyGoogleUser", verifyGoogleUser )


user.get("/relatedProduct", isBlocked, relatedProduct)
user.get('/listAllProducts', isBlocked, listAllProducts)
user.get('/products', isBlocked, listProductByFilter)

user.get('/listCategory', listCategory)

user.get('/cart', authenticateToken,isBlocked,authenticateToken, listCart)
user.put('/cart', authenticateToken, isBlocked, addToCart);
user.patch('/cart', authenticateToken, isBlocked, updateCount)
user.delete('/cart', authenticateToken, isBlocked, deleteCartProducts)
user.get('/cartCount', isBlocked, cartCount)

user.get('/address', isBlocked, listAddress);
user.get('/singleAddress', isBlocked, singleAddress)
user.patch('/address',isBlocked, editAddress)
user.post("/address", isBlocked, addAddress);
user.delete("/address", isBlocked, deleteAddress)

user.get('/profile', isBlocked, listProfileThings);

user.get('/checkProducts', checkProductAvailability) // productAvilable checking


user.post("/order", authenticateToken, isBlocked, addOrder)   
user.get('/sendOrderMail', isBlocked, sendOrderMail)
user.get('/order', authenticateToken, isBlocked, listOrder)
user.delete("/order", authenticateToken, isBlocked, cancelOrder)
user.post("/create-order", authenticateToken, isBlocked, razorpayToken)
user.put("/order", authenticateToken, isBlocked, editOrder)

user.post('/forgot-password', isBlocked, forgetPasswordOtp);
user.post('/reset-password', isBlocked, resetPassword);


// wishList

user.get('/wishList', authenticateToken, isBlocked, listWishlist)
user.put('/wishList', authenticateToken, isBlocked, addWishList)
user.delete('/wishList', authenticateToken, isBlocked, removeWishList)


// offer


// coupon
user.get('/coupon', authenticateToken, isBlocked, getCoupons);
user.post('/checkCoupon', authenticateToken, isBlocked, checkApplyCode);


user.get('/wallet/:userId', authenticateToken, isBlocked, getWallet)

module.exports = user