const { default: mongoose } = require("mongoose")
const Address = require("../../models/addressSchema")
const Order = require("../../models/ordersSchema")
const createEmail = require("../../services/nodemailer")
const Cart = require("../../models/CartSchema")

const getOrderFormData = (originalData) =>{
    return {
        userId: originalData.products[0].userId,
        items: originalData.products.map((product) => {
            return {
                productId: product.cartItems.productId,
                stocks: product.cartItems.stocks.map((stock) => (
                    
                  {
                    size: stock.size,
                    quantity: stock.quantity,
                  }
                
                )),
                price: product.productDetails.currentPrice,
                total:  product.cartItems.stocks.reduce((acc, stock) => acc+stock.quantity ,0) * product.productDetails.currentPrice,
                status: "Pending", // Default status
            }
        }).flat(),
        totalAmount: originalData.totalAmt,
        shippingAddress: originalData.selectedAddress,
        paymentMethod: "cod", // Example payment method
        paymentStatus: "pending", // Default
        orderStatus: "pending", // Default
    }
      
}

const addAddress = async(req, res) =>{
    let formData = req.body
    try{
        let address = new Address(formData)
        console.log(address)
        address.save();
        res.json('new address added')
    }
    catch(error){
        console.log('error', error);
        res.status(500).json('try again')
    }
} 

const listAddress = async(req, res) =>{
    console.log(req.query)
    let {userId} = req.query
    userId = new mongoose.Types.ObjectId(userId)
    try{

        let addresses = await Address.find({userId, isDeleted: false})
        res.json(addresses)

    }
    catch(error){
        res.status(500).json('try again')
    }
}

const addOrder = async(req, res) =>{
    
    try{
        let data = getOrderFormData(req.body)
        let order = new Order(data)
        console.log("deref",order,"order")
        order.save();
        let userId = new mongoose.Types.ObjectId(order.userId)
        let deleteCartItems = await Cart.findOneAndUpdate({userId},{$set:{cartItems:[]}})
        console.log(deleteCartItems)
        res.json(order)
        
    }
    catch(error){
        console.log(error)
    }
} 

const editAddress = async(req, res) =>{
    let formData = req.body;
    
    let {_id, userId} = formData
    _id = new mongoose.Types.ObjectId(_id)
    userId= new mongoose.Types.ObjectId(userId)
    try{
        const editedAddress = await Address.findOneAndUpdate({_id},{$set:{...formData}})
        res.json('adrres edited 😊')
    }
    catch(error){
        res.status(500).json('try again later')
    }
}

const deleteAddress = async(req, res) =>{

    try{
        let {_id} = req.query;
        _id = new mongoose.Types.ObjectId(_id)
        let deletedAddress = await Address.findOneAndUpdate({_id: _id},{$set:{isDeleted: true}})
        console.log(deletedAddress)
        res.json("address deleted")
    }
    catch(error){
        console.log(error);
        res.status(500).json("try again")
    }
}

const sendOrderMail = async(req, res) =>{

    try{
        const data = req.query
        console.log(data,"mail send")
        console.log(data.username, data.email)
        let sendMail = await createEmail(data.email, data, false)
        console.log(sendMail)
        res.json('message')
    }
    catch(error){
        console.log(error)
        res.status(500).json()
    }
}

const listOrder = async(req, res) =>{

    let {userId} = req.query
    userId = new mongoose.Types.ObjectId(userId)
    try{    
        let orders = await Order.find({userId}).populate({
            path:'items.productId',
            select: 'name description currentPrice regularPrice images stock category',
        }).sort({createdAt:-1});
        console.log(orders,"print")
        res.json(orders)
    }
    catch(error){
        console.log(error)
        res.status(500).json('try again later')
    }
}


const cancelOrder = async(req, res) =>{
    let {userId, productId, orderId, portion} = req.query
    
    try{
        let orders = await Order.findById(orderId)
        // full
        if(portion === 'FULL') {
            orders.items.map(item => item.status = 'Cancelled')
            orders.orderStatus = "Cancelled"
            return res.json('cancelled the order')
        }

        // if one product 
        let cancelproduct  = orders.items.find(item => item.productId == String(new mongoose.Types.ObjectId(productId)))
        cancelproduct.status = 'Cancelled'
        if(orders.items.every(item => item.status === 'Cancelled')){
            orders.orderStatus = "Cancelled"
        }
        orders.save()

        console.log(orders)
        res.json('product cancelled from the order')
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    addAddress,
    listAddress,
    editAddress,
    addOrder,
    sendOrderMail,
    listOrder,
    cancelOrder,
    deleteAddress
}