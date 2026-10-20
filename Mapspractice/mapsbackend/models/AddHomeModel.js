const mongoose = require("mongoose");
const UserModedl = require("../models/UserModel");
const AddSchema = new mongoose.Schema({
    email:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true,
    },
    placeName:{
        type:String,
        required:true
    },
    cityName:{
        type:String,
        required:true,
    }
},{timestamps:true});

const addAddress = mongoose.model("addAddress",AddSchema);

module.exports = addAddress;