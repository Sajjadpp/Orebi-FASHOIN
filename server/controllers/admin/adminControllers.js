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

const getOrders = async(req, res) => {
  try {
    let orders = await Orders.aggregate([
      // Lookup for user details
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
      // Lookup for shipping address
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
      // Lookup for product details
      {
        $lookup: {
          from: "products",
          let: { orderItems: "$items" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", {
                    $map: {
                      input: "$$orderItems",
                      as: "item",
                      in: "$$item.productId"
                    }
                  }]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                images: 1,
                category: 1,
                stock: 1
                // Explicitly NOT including price fields
              }
            }
          ],
          as: "productDetails"
        }
      },
      // Combine order items with product details while preserving original price
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

    res.status(200).json(orders.reverse());
  } catch(error) {
    console.error('Error in getOrders:', error);
    res.status(500).json('server error');
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.query;

  try {
    let updateOrder = await Orders.findOne({ _id: req.query._id });

    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status and payment status
    updateOrder.orderStatus = status;
    updateOrder.paymentStatus = status === "Shipped" ? "success" : status === "Cancelled" ? "refunded" : "failed";
    updateOrder.items.map((product) => (product.status = status));

    // Decrement stock only when the order is "Shipped"
    if (status === "Shipped") {
      for (const item of updateOrder.items) {
        let { productId, stocks } = item;
        productId = new mongoose.Types.ObjectId(productId);

        // Loop through the stocks array to update quantities for each size
        for (const stockItem of stocks) {
          const { size, quantity } = stockItem;
          await Product.findOneAndUpdate(
            { _id: productId, "stock.size": size }, // Match product and size
            { $inc: { "stock.$.quantity": -quantity } } // Decrease stock quantity
          );
        }
      }
    }

    // Restock items if the order status is "Cancelled"
    if (status === "Cancelled") {
      for (const item of updateOrder.items) {
        let { productId, stocks } = item;
        productId = new mongoose.Types.ObjectId(productId);

        // Loop through the stocks array to update quantities for each size
        for (const stockItem of stocks) {
          const { size, quantity } = stockItem;
          await Product.findOneAndUpdate(
            { _id: productId, "stock.size": size }, // Match product and size
            { $inc: { "stock.$.quantity": quantity } } // Increase stock quantity
          );
        }
      }
    }

    await updateOrder.save();

    res.json("Order updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong, please try again");
  }
};

const handleReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, action } = req.body;

    if (!orderId || !productId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
    }

    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Find the specific item in the order
    const itemIndex = order.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in order'
      });
    }

    // Check if the item is in return-request status
    if (order.items[itemIndex].status !== 'return-request') {
      return res.status(400).json({
        success: false,
        message: 'Item is not in return request status'
      });
    }

    // Update the item status based on action
    const newStatus = action === 'accept' ? 'Returned' : 'Return Declined';
    order.items[itemIndex].status = newStatus;

    await order.save();

    // Send notification to customer about return status
    // await sendReturnStatusNotification(order.user, productId, newStatus);

    return res.status(200).json({
      success: true,
      message: `Return request ${action}ed successfully`
    });

  } catch (error) {
    console.error('Error handling return request:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



const changeStock = async(req, res) =>{

  try{
    const {stock, _id} = req.body;
    console.log(stock, _id)
    await Product.findOneAndUpdate({_id: _id}, {$set:{stock:stock}})
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
  changeStock,
  handleReturnRequest
}