const express = require('express');
const { adminLogin, addCategory, listCategory, changeStock , getOrders, editCategory, addProduct, productList, editProduct, listAll, listAllUsers, toogleBlock, toogleProduct, updateOrderStatus } = require('../controllers/admin/adminControllers');
const admin = express.Router();
const upload = require("../services/cloudinary");
const { isAuth } = require('../Auth/adminAuth');
const { getOffer, addOffer, deleteOffer, listCoupon, addCoupon, deleteCoupon, editCoupon } = require('../controllers/admin/offerAndCouponController');
const { getSalesReport } = require('../controllers/admin/salesReport');

admin.post("/login", adminLogin)

admin.post("/category", isAuth, addCategory)

admin.get("/listCategory", isAuth, listCategory)

admin.put('/editCategory', isAuth, editCategory);

admin.post('/addProduct', isAuth, upload.array("images", 3),addProduct)

admin.get("/productList", isAuth, productList)

admin.put('/product', isAuth, editProduct)
admin.patch('/product', isAuth, changeStock)
admin.patch('/product', isAuth, toogleProduct)

admin.get("/listAll",isAuth,  listAll)

admin.get('/listAllUsers', isAuth, listAllUsers)

admin.patch("/toogleBlock", isAuth, toogleBlock)


admin.get('/orders', isAuth, getOrders)

admin.patch('/orders',isAuth, updateOrderStatus)


admin.get('/offer', isAuth, getOffer);
admin.post('/offer', isAuth, addOffer);
admin.delete('/offer/:id', isAuth, deleteOffer);

// coupon
admin.get('/coupon', isAuth, listCoupon);
admin.post('/coupon', isAuth, addCoupon);
admin.put('/coupon/:id', isAuth, editCoupon);
admin.delete('/coupon/:id', isAuth, deleteCoupon);


// sales report 
admin.get('/sales-report', isAuth, getSalesReport)

module.exports = admin