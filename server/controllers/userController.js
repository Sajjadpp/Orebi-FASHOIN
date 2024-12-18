const User = require("../models/userSchema")
const createEmail = require('../services/nodemailer')
const {generateToken} = require("../services/jwt")
const { OAuth2Client } = require('google-auth-library')
const bcrypt = require("bcrypt")

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
        let response = await createEmail(email, otp)
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
        console.log(userExist.password)
        if(userExist && !userExist.password) return res.status(401).json("please login with google")
        const comparePass = await bcrypt.compare(userExist.password, password)
        if(!comparePass) return res.status(401).json("password not valid")
        
        let token = await generateToken({user: userExist._id});
        delete userExist.password
        const {_id, username} = userExist
        res.cookie("OREBI_TOKEN", token)
        console.log('wrokgin', userExist)
        let newObj = {...userExist}._doc;
        console.log(newObj,"working")
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
        console.log(user)
        if(user){

            user.profile ??= payload.picture; // if profile kept that otherways payload
            user.googleId ??= payload.sub
            await user.save()
            let token = await generateToken(user._id)
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
            let token = await generateToken(newUser._id)
            responseData = {...newUser._doc, token}
        }
        res.status(200).json({message: "user logined successfully", user: responseData})
    }
    catch(error){
        console.log("error", error)
        res.status(500).json({message: "server error please try again later"})
    }
}

module.exports= {
    emailExist,
    sentOtp,
    verifyOtp,
    verifyUser,
    verifyGoogleUser
} 