const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const User = require('../models/userSchema');
const {  verifyToken } = require('../services/jwt');

const authenticateToken = (req, res, next) => {
    console.log('eotrking')
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Token missing or invalid' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalid or expired' });
      }
      console.log(user)
      req.user = user; // Attach user information to the request
      next();
    });
};

const isBlocked = async (req, res, next) => {
    console.log('working')
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return next();
    }
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            console.log(err);
            return next();
        }
 
        console.log(user, "user side");
        req.user = user; // Attach user information to the request
        
        if (req.user) {
            // Use req.user._id to create the ObjectId
            let userId = new mongoose.Types.ObjectId(req.user.user); 

            console.log(userId, "is User");
            let isUser = await User.findById(userId);
            console.log(isUser,"user exist")
            if (!isUser.status) {
                return res.status(403).json("User is blocked by admin");
            }
        }
        next();
    });
};

const isCapableToCod = (req, res, next) =>{

    const {totalAmt: totalAmount, selectedPayment} = req.body
    console.log(totalAmount, selectedPayment)
    if(totalAmount > 1000 && selectedPayment === "cod"){
        return res.status(500).json(`The total amount is ₹${totalAmount}. Please select a different payment option for amounts greater than ₹1000.`)
    }
    next()
}

module.exports = {
    authenticateToken,
    isBlocked,
    isCapableToCod
}