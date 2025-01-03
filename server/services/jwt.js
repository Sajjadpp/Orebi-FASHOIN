const jwt = require("jsonwebtoken") 

const generateToken =(userData)=>{

    try{
        
        return jwt.sign({...userData}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })
        
    }
    catch(err){
        console.log(err)
        return 
    }
}

const verifyToken = (token, req) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return 
        }
        console.log(user,"user side")
        return user; // Attach user information to the request
    });
}

module.exports={

    generateToken,
    verifyToken
}