const express = require("express");
const app = express();
const mongoose = require("mongoose");
const CoachSignUp = require("./models/CoachSignUp")
const {CoachProfileCreation,CoachLogin} = require("./Controllers/CoachSignUp")
const cors = require("cors");
const multer = require("multer");
const storage = require("multer-storage-cloudinary");
const cloudninary = require("cloudinary").v2;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/CoachSignUp").then(()=>{
    console.log("Db connected successfully")
})

app.post("/CoachSignUp",CoachProfileCreation);

app.post("/CoachLogin",CoachLogin);


app.listen(4000,()=> console.log("Server started successfully"))