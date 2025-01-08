const User = require("../../models/userSchema")
const createEmail = require('../../services/nodemailer')
const {generateToken} = require("../../services/jwt")
const { OAuth2Client } = require('google-auth-library')
const bcrypt = require("bcrypt")
const { default: mongoose } = require("mongoose")
const Product = require("../../models/ProductSchema")
const Address = require("../../models/addressSchema")
const Orders = require('../../models/ordersSchema')


 const generateOtp = ()=>{
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp)
    return otp
}

const emailExist = async(req, res)=>{
    console.log(req.body)
    const {email} = req.body
    try{
        
        const userExist = await User.findOne({email: email});
        console.log(userExist)
        return res.json({status: true, userExist: userExist ? true : false}).status(200)
        
    }
    catch(err){
        
        console.log("error occured", err)
        res.json({status: false}).status(500)
    }
}


const sentOtp = async(req, res) =>{

    console.log(req.body)
    let {email} = req.body
     try{
        let otp = generateOtp()
        let response = await createEmail(email, otp, true)
        console.log(response,"fdodfj")
        req.session.otp = otp;
        res.json({status: true, message: "otp sent"}).status(200)
     }
     catch(err){
         console.log(err, 'error occured')
         res.json({status: false, message: "internal error"}).status(500)
     }
}

const verifyOtp = async(req, res) =>{

    const {otp, ...userData} = req.body;
    console.log(otp, userData)
    
    if(req.session.otp != otp) return res.status(401).json("invalid otp");

    try{
        let hashPass = await bcrypt.hash(userData.password, 10);
        console.log(hashPass)
        let user = new User({...userData, username: userData.fullName, password: hashPass});
        
        user.password = hashPass
        user.save();
        console.log(user)
        let token = generateToken({user: user._id})
        delete user.password

        res.cookie("OREBI_TOKEN",token, {maxAge: 1000*60*60*24})
        res.json({message:"user verified lets begin! ", user, token})
    }
    catch(err){
        console.log(err)
        res.status(500).json("verification failed try again later")
    }
}

const   verifyUser = async(req, res) =>{

    try{
        console.log(req.body)
        const {email, password} = req.body
        let userExist = await User.findOne({email: email})
        if(!userExist) return res.status(401).json("user doesnt exist");

        if(userExist && !userExist.password) return res.status(401).json("please login with google")
        const comparePass = await bcrypt.compare( password, userExist.password)
        if(!comparePass) return res.status(401).json("password not valid")
        
        let token = await generateToken({user: userExist._id});
        delete userExist.password
        const {_id, username} = userExist
        res.cookie("OREBI_TOKEN", token)
        let newObj = {...userExist}._doc;
        res.status(200).json({message: "login successfully", user:{token, ...newObj}});
    }
    catch(err){
        console.log(err)
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const verifyGoogleUser = async(req, res)=>{
    
    let responseData = {}
    console.log(req.body)
    let googleToken = req.body.token;
    try{

        const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log(payload)

        let user = await User.findOne({email: payload.email});

        if(user && !user.status) return res.status(403).json('user blocked by admin')
        console.log(user)
        if(user){

            user.profile ??= payload.picture; // if profile kept that otherways payload
            user.googleId ??= payload.sub
            await user.save()
            let token = await generateToken({user:user._id})
            res.cookie('ORIBI_TOKEN',token, {maxAge: 1000*60*60*24} )
            responseData ={...user._doc, token}
        }
        else{
            
            let newUser = new User({
                username : payload.name,
                email :payload.email,
                googleId : payload.sub,
                profile : payload.picture,
                status: true
            })
            console.log(newUser)
            await newUser.save()
            let token = await generateToken({user: newUser._id})
            res.cookie('ORIBI_TOKEN',token, {maxAge: 1000*60*60*24} )
            responseData = {...newUser._doc, token}
        }
        
        res.status(200).json({message: "user logined successfully", user: responseData})
    }
    catch(error){
        console.log("error", error)
        res.status(500).json({message: "server error please try again later"})
    }
}

const relatedProduct = async(req, res)=>{

    try{
        let {category, thisProduct} = req.query
        thisProduct = new mongoose.Types.ObjectId(thisProduct)
        console.log(category, req.query)
        let relatedProducts = await Product.find({category: category, _id:{$ne:thisProduct}})
        console.log(relatedProducts)
        res.json(relatedProducts)
    }
    catch(error){
        console.log(error)
        res.status(500).json('error occured')
    }
}

const listAllProducts = async(req, res) =>{

    try{
        let product = await Product.find({status:true});
        res.json(product)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error.message || "server issue")
    }
}



const listCategory =async(req, res) =>{
    console.log("listCategory")
    let categoryName = req.query.category
    console.log(categoryName)
    try{
        const parentCategory = await Category.findOne({name: categoryName})
        console.log(parentCategory)
        const categoryList = await Category.find({_id: parentCategory._id})
        res.json(categoryList)

    }
    catch(error){
        res.status(500).json(error.message)
        console.log(error)
    }
}


const updateUser = async(req, res) =>{

    try{
        const {firstName, lastName, email, mobileNo} = req.body;
        let username = `${firstName} ${lastName}`

        let user = await User.updateOne({email: email},{username, mobileNo})
        console.log(user)
        res.json(username)
    }
    catch(error){
        console.log(error)
        res.status(500).json('server error')
    }
}


const resetPassword = async(req, res) =>{

    try{
        const {email, password} = req.body;
        console.log(email, password);
        const hashPass = await bcrypt.hash(password, 10);
        let user = await User.findOneAndUpdate({email},{$set:{password: hashPass}});
        res.json('password reseted');
    }
    catch(error){
        console.log(error);
        res.status(500).json(error)
    }
}

const listProfileThings = async(req, res) =>{
    let { _id } = req.query
    try{
        let AddressCount = await Address.find({userId: _id});
        let OrdersCount = await Orders.find({userId: _id});
        console.log(AddressCount.length, OrdersCount.length,'count')
        res.status(200).json([{label: "address", count: AddressCount.length},{label: 'Orders',count: OrdersCount.length}])
    }
    catch(error){
        console.log(error)
        res.status(500).json('try again later')
    }
}


const listProductByFilter =  async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const sortBy = req.query.sortBy || 'featured';
        const category = req.query.category || 'all';
        const searchQuery = req.query.search || '';
        
        // Build query
        const query = {};
        
        // Add category filter
        if (category !== 'all') {
            query.category = category;
        }

        // Add search functionality
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        // Build sort configuration
        let sortConfig = {};
        switch (sortBy) {
            case 'price-asc':
                sortConfig = { currentPrice: 1 };
                break;
            case 'price-desc':
                sortConfig = { currentPrice: -1 };
                break;
            case 'name-asc':
                sortConfig = { name: 1 };
                break;
            case 'name-desc':
                sortConfig = { name: -1 };
                break;
            case 'new':
                sortConfig = { createdAt: -1 };
                break;
            default:
                sortConfig = { featured: -1 };
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Get total count of products matching the query
        const totalProducts = await Product.countDocuments(query);

        // Fetch products with pagination and sorting
        const products = await Product.find(query)
            .sort(sortConfig)
            .skip(skip)
            .limit(limit);

        // Get unique categories
        const categories = await Product.distinct('category');

        // Send response
        res.json({
            status: 'success',
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalProducts / limit),
                    totalProducts,
                    productsPerPage: limit
                },
                categories: ['all', ...categories]
            }
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching products',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports= {
    emailExist,
    sentOtp,
    verifyOtp,
    verifyUser,
    verifyGoogleUser,
    relatedProduct,
    listAllProducts,
    listCategory,
    updateUser, 
    generateOtp,
    resetPassword,
    listProfileThings,
    listProductByFilter
 
} 