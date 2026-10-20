const express = require("express");
const server = express();
const mongoose = require("mongoose");
const UserRouter = require("./routes/UserRotuter")
const dotenv = require("dotenv");
const cors = require("cors");

server.use(express.json());
dotenv.config();
server.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));



mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected successfully");
}).catch((err)=>{
console.log(err);
});
server.get("/",(req,res)=>{
    res.json({
        message:
            "hello welcome to HOME RENTAL SYSTEM"
        
    });
});

server.use("/api",UserRouter);



server.listen(7777,()=> console.log("server started at 7777"));
