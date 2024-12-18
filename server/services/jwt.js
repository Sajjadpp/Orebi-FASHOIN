const jwt = require("jsonwebtoken") 

const generateToken = (userData)=>{

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

module.exports={

    generateToken
}