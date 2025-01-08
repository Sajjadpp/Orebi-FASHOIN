const express = require("express")
const app = express();
const cors = require('cors')
const connection = require("./config/connection");
const socketSetUp = require("./services/SOCKET/socket")
require("dotenv").config()
const session = require('express-session')
const http = require('http')
const morgan = require('morgan');
const socketServer = http.createServer(app)

const userRouter = require("./Routes/userRouter");
const adminRouter = require("./Routes/adminRouter")

connection();



app.use(morgan("tiny"))
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true , limit: "10mb"}))
app.use(cors({
    origin: process.env.CLIENT_PORT, // setting cors to connect to client
    credentials: true
}))

socketSetUp(socketServer)

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

socketServer.listen(3009, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });