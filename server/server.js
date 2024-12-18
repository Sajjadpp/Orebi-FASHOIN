const express = require("express")
const app = express();
const cors = require('cors')
const connection = require("./config/connection")
require("dotenv").config()
const session = require('express-session')


const userRouter = require("./Routes/userRouter");
const adminRouter = require("./Routes/adminRouter")

connection()

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true , limit: "10mb"}))
app.use(cors({
    origin: "http://localhost:3000", // setting cors to connect to client
    credentials: true
}))


app.use(session({
    secret: "key",
    resave: true,
    saveUninitialized: false,
    cookie:{maxAge: 1000*60},
}))

app.use("/api/user", userRouter) // creating routes for user
app.use("/api/admin", adminRouter) // creating routes for admin

app.listen(process.env.PORT, ()=>{
    console.log('connected successfuly')
})
