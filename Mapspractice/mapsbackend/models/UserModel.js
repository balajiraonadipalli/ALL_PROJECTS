const mongoose = require("mongoose");
const token = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const schema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});

schema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    return this.password = await bcrypt.hash(this.password,10);
});

schema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

const mapUsers = mongoose.model("mapUsers",schema);


module.exports = mapUsers;