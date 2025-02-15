const mongoose = require("mongoose")

let connect = ()=> {

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,  // Forces secure connection
        tlsAllowInvalidCertificates: false,
      })
      .then(() => console.log("✅ MongoDB Connected!"))
      .catch(err => console.error("❌ MongoDB Connection Error:", err));
}

module.exports = connect