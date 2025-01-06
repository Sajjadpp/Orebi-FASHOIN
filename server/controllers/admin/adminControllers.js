const { default: mongoose } = require("mongoose");
const admin = require("../../models/adminSchema");
const Category = require('../../models/CategorySchema')
const bcrypt = require("bcrypt")
const Product = require("../../models/ProductSchema")
const Users = require("../../models/userSchema");
const Orders = require('../../models/ordersSchema')
const { generateToken } = require("../../services/jwt");
const adminLogin= async(req, res)=>{

    try{
        const {email, password} = req.body;
        console.log(email, password)

        const userExist = await admin.findOne({email: email});

        if(!userExist) return res.status(401).json("invalid email");

        const comparePass = await bcrypt.compare(password, userExist.password);

        if(!comparePass) return res.status(401).json('password not match')
        
        let token = await generateToken({userExist})
        res.cookie("OREBI_TOKEN_admin",token, {maxAge: 1000*60*60*24})
        res.json({message: 'admin loggined successfull', token});
    }
    catch(error){
        console.log(error)
        res.status(401).json("server error")
    }
}

const addCategory=async (req, res) =>{

    try{
      let {name, description, parentCategory} = req.body
      let regex = new RegExp(`^${name}$`,"i")
      let categoryExist = await Category.findOne({name: regex})
      if(categoryExist) return res.status(409).json("category already exist");
      
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
        console.log("working")
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


const editProduct = async (req, res) => {
  try {
    const { _id, ...productDetails } = req.body;
    console.log(_id)
    // Log product details for debugging
    console.log(productDetails, "product details");

    // Update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id },
      { $set: productDetails },
      { new: true } // Returns the updated document
    );

    console.log(updatedProduct); // Log updated product for debugging
    res.json("Product updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Try again later");
  }
};


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


const toogleBlock=async(req, res) =>{

    try{
        console.log(req.query.id)
        let userId = new mongoose.Types.ObjectId(req.query.id);
        let blockStatus = req.query.blockStatus
        console.log(blockStatus)
        let status = blockStatus !== "true"
        
        let update = await Users.updateOne({_id: userId},{$set:{status:status}})
        console.log(update)
        res.json(`user ${status ? "unblocked" : "blocked"} successfully`)
    }
    catch(error){
        console.log(error)
        res.status(500).json("server error")
    }
}


const toogleProduct = async(req, res)=>{

    try{
        let {productId, productStatus} = req.query;
        productId = new mongoose.Types.ObjectId(productId)
        productStatus = productStatus !== "true"
        await Product.updateOne({_id: productId},{$set:{status:productStatus}})
        res.json(`product ${!productStatus? "de" : ""}activated successfully`)
    }
    catch(error){
        console.log(error);
        res.status(500).json("server error")
    }
}

const getOrders = async(req, res) =>{
    try{
        let orders = await Orders.aggregate([
            // Existing lookups for user and shipping address
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: 'user'
              }
            },
            {
              $unwind: "$user"
            },
            {
              $lookup: {
                from: "addresses",
                localField: "shippingAddress",
                foreignField: "_id",
                as: 'shippingAddress'
              }
            },
            {
              $unwind: "$shippingAddress"
            },
            // New lookup for products
            {
              $lookup: {
                from: "products",
                let: { items: "$items" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ["$_id", "$$items.productId"]
                      }
                    }
                  }
                ],
                as: "productDetails"
              }
            },
            // Modify items array to include product details
            {
              $addFields: {
                "items": {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: {
                      $mergeObjects: [
                        "$$item",
                        {
                          productDetails: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$productDetails",
                                  cond: { $eq: ["$$this._id", "$$item.productId"] }
                                }
                              },
                              0
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
        ]);
        console.log(orders)
        res.status(200).json(orders)
    }
    catch(error){
        res.status(500).json('server error')
    }
}

const updateOrderStatus = async(req,res) =>{
    const {status} = req.query
    console.log(req.query)
    try{
        let _id = new mongoose.Types.ObjectId(req.query._id)
        let updateOrder = await Orders.findOne({_id});
        console.log(updateOrder)
        updateOrder.orderStatus = status;
        updateOrder.paymentStatus = status === "Shipped" ? "success" : 'failed';
        updateOrder.items.map(product => product.status = status)
        updateOrder.save();
        console.log(updateOrder)
        res.json(updateOrder)
    }
    catch(error){
        console.log(error)
        res.status(500).json("try again");
    }
}

const changeStock = async(req, res) =>{

  try{
    const {stock, _id} = req.body;
    console.log(stock, _id)
    const newProduct = await Product.findOneAndUpdate({_id: _id}, {$set:{stock:stock}})
    res.json('stock updated')
  }
  catch(error){
    console.log(error)
    res.status(500).json('stock updated')

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
    listAllUsers,
    toogleBlock,
    toogleProduct,
    getOrders,
    updateOrderStatus,
    changeStock
}