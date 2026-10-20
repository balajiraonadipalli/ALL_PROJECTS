const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const userRouter = require("./routes/UserRouter");
const groupRouter = require("./routes/groupRouter");
const messageRouter = require("./routes/messageRouter");
dotenv.config();
const app = express();

const server = http.createServer(app);

// const io = socketIo(server,{
//     cors:{
//         origin:["",""],
//         methods:["GET","POST"],
//         Credentials:true,
//     },
// });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(()=> console.log("Connected to DB")).catch((err)=> console.log("MongoDB connection Failed",err));

app.get("/",(req,res)=>{
    res.json({
        project:"MERN Chat",
        message:"welcome to chat application",
        developedBy:"Balu",
        website:"WWW.balu.com",
    });
});

app.use("/api/users",userRouter);
app.use("/api/groups",groupRouter);
app.use("/api/messages",messageRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server started",PORT));