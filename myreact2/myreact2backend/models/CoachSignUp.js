const mongoose = require("mongoose");

const CoachProfileSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },

},{timestamps:true});

module.exports = mongoose.model("CoachSignUp",CoachProfileSchema);
