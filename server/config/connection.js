const mongoose = require("mongoose")

let connect = ()=> {

    mongoose.connect(process.env.MONGO_URI)
}

module.exports = connect