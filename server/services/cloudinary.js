const multer = require("multer")
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "orebi-storage",
        allowed_formats : ["jpeg, jpg, png"]
    },
    onFileUploadStart: (file) => {
        console.log(`Uploading ${file.originalname}`);
    }
    
})

module.exports = multer({storage})