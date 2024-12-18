const express = require('express');
const { adminLogin, addCategory, listCategory, editCategory, addProduct, productList, editProduct, listAll, listAllUsers } = require('../controllers/adminControllers');
const admin = express.Router();
const upload = require("../services/cloudinary")

admin.post("/login", adminLogin)

admin.post("/addCategory", addCategory)

admin.get("/listCategory", listCategory)

admin.put('/editCategory', editCategory);

admin.post('/addProduct', upload.array("images", 3),addProduct)

admin.get("/productList", productList)

admin.put('/editProduct', upload.array("images", 3), editProduct)

admin.get("/listAll", listAll)

admin.get('/listAllUsers', listAllUsers)

admin.patch("/toogleBlock", )

module.exports = admin