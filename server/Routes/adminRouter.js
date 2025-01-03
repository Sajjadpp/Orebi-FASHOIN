const express = require('express');
const { adminLogin, addCategory, listCategory , getOrders, editCategory, addProduct, productList, editProduct, listAll, listAllUsers, toogleBlock, toogleProduct, updateOrderStatus } = require('../controllers/admin/adminControllers');
const admin = express.Router();
const upload = require("../services/cloudinary");
const { isAuth } = require('../Auth/adminAuth');

admin.post("/login", adminLogin)

admin.post("/category", isAuth, addCategory)

admin.get("/listCategory", isAuth, listCategory)

admin.put('/editCategory', isAuth, editCategory);

admin.post('/addProduct', isAuth, upload.array("images", 3),addProduct)

admin.get("/productList", isAuth, productList)

admin.put('/product', isAuth, editProduct)

admin.get("/listAll",isAuth,  listAll)

admin.get('/listAllUsers', isAuth, listAllUsers)

admin.patch("/toogleBlock", isAuth, toogleBlock)

admin.patch('/product', isAuth, toogleProduct)

admin.get('/orders', isAuth, getOrders)

admin.patch('/orders',isAuth, updateOrderStatus)


module.exports = admin