const { default: mongoose } = require("mongoose")
const Address = require("../../models/addressSchema")
const Order = require("../../models/ordersSchema")
const createEmail = require("../../services/nodemailer")
const Cart = require("../../models/CartSchema")
const Products = require('../../models/ProductSchema')


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

const singleAddress = async(req, res) =>{

    try{
        const address = await Address.findById({_id: req.query.addressId})
        res.json(address)
    }
    catch(error){
        console.log(error);
        res.status(500).json('server is busy')
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


module.exports = {
    addAddress,
    listAddress,
    editAddress,
    sendOrderMail,
    listOrder,
    deleteAddress,
    singleAddress
}