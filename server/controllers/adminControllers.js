const { default: mongoose } = require("mongoose");
const admin = require("../models/adminSchema");
const Category = require('../models/CategorySchema')
const bcrypt = require("bcrypt")
const Product = require("../models/ProductSchema")
const Users = require("../models/userSchema")
const adminLogin= async(req, res)=>{

    try{
        const {email, password} = req.body;
        console.log(email, password)

        const userExist = await admin.findOne({email: email});

        if(!userExist) return res.status(401).json("invalid email");

        const comparePass = await bcrypt.compare(password, userExist.password);

        if(!comparePass) return res.status(401).json('password not match')

        res.json('admin loggined successfull');
    }
    catch(error){
        console.log(error)
        res.status(401).json("server error")
    }
}

const addCategory=async (req, res) =>{

    try{
        let {name, description, parentCategory} = req.body

        let categoryExist = await Category.findOne({name})
        if(categoryExist) return res.status(409).json("category already ecist");

        if(parentCategory) req.parentCategory = new mongoose.Types.ObjectId(parentCategory)
        console.log(parentCategory)
        let category = new Category(req.body)
        await category.save();

        res.status(200).json("category added successfull")
    }
    catch(error){
        console.log(error)
        res.status(500).json("server error")
    }
}

const listCategory =async(req, res) =>{
    console.log("listCategory")
    try{
        const categoryList = await Category.aggregate([
            {$match:{type: "0"}},
            {$lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "parentCategory",
              as: "subCategories"
            }}
        ])
        res.json(categoryList)

    }
    catch(error){
        res.status(500).json(error.message)
        console.log(error)
    }
}

const editCategory = async(req, res) =>{
    const {name, description, id} = req.body;
    let ObjectId = new mongoose.Types.ObjectId(id)
    try{
        let categoryExist = await Category.findOne({name: name, _id:{$ne:ObjectId}})
        if(categoryExist) return res.status(409).json("category already exist")

        let category = await Category.findById(ObjectId);
        category.name =name;
        category.description = description;
        await category.save();

        res.json("category edited successfully");
    }
    catch(error){

        res.status(500).json("server error")
    }
}

const addProduct = async(req, res) =>{

    try{
        const productData = req.body;
        const images = req.files.map(file => file.path)
        console.log(images, "image", productData)
        
        let product = new Product({...req.body, images,status:true, stock: JSON.parse(productData.stock)})

        console.log(product)
        await product.save();

        res.json("product added successfully")
    }
    catch(error){
        console.log(error, "Error")
        res.status(500).json('server error')
    }
}

const productList = async(req, res) =>{

    try{
        console.log("product listing")
        let products = await Product.find({}).exec()
        console.log(products)
        res.json(products)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error.message || "server not responding")
    }
}   


const editProduct = async(req, res) =>{
    console.log(req.body)
    let productId = new mongoose.Types.ObjectId(req.body._id)
    try{
        let productEdit = await Product.updateOne({_id: productId},{
            $set:req.body
        });
        console.log(await productEdit)
        res.json("updated successfully")
    }
    catch(error){
        console.log(error)
        res.status(500).json("server error")
    }
}

const listAll =async(req, res)=>{

    try{
        let product = await Product.find({status: true});
        console.log("products")
        res.json(product)
    }
    catch(error){
        console.log(error);
        res.status(500).json("server error")
    }
}


const listAllUsers=async(req, res)=>{

    try{
        let users = await Users.find({});

        
        res.json(users);
    }
    catch(error){
        cosnole.log("error ", error)
    }
}


const toogleBlock=(req, res) =>{

    try{
        let userId = mongoose.Types.ObjectId(req.params.id);
        
        Users.updateOne({_id: userId},{$set:{}})
    }
}

module.exports = {
    adminLogin,
    addCategory,
    listCategory,
    editCategory,
    addProduct,
    productList,
    editProduct,
    listAll,
    listAllUsers
}