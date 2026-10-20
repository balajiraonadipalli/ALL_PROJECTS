const express = require("express");
const userRouter = express.Router();
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const  Protect  = require("../middlewares/Protect");
const addHomeModel = require("../models/AddHomeModel")

userRouter.post("/register",async function(req,res){
    
    try {
        const {username,email,password} = req.body;
        console.log(req.body);
        const UserExist = await UserModel.findOne({email});
    if(UserExist){
        return res.status(400).json({message:"user Already exists"});
    }
    const newUser = await UserModel.create({
        username,
        email,
        password
    });
    console.log(newUser);
    if(newUser){
         return res.status(201).json({
            userId:newUser._id,
            username:newUser.username,
            password:newUser.email
        });
    }
    
    } catch (error) {
        return res.status(400).json({message:error.message})
    }

});

userRouter.post("/login",async function(req,res){
    const {email,password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user && (await user.matchPassword(password))){
            return res.json({
                user:{
                    userId:user._id,
                    username:user.username,
                    email:user.email,
                    token:generateToken(user._id)
                }
            });

        }
        res.status(401).json({message:"Invalid Username and Password"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

const generateToken= (id)=>{
    return jwt.sign({ id }, process.env.JSON_TOKEN, {
        expiresIn: "10d"
    });

};

userRouter.get("/addHome",Protect,(req,res)=>{
    // console.log(req.user);
    res.json(
       {
         message:req.user
       }
    ) 
});

userRouter.post("/addHome",Protect,async (req,res)=>{
    try {
        const {cityName,placeName} = req.body;
        
        const email = req.user;
        if(email){
            const addAddress = await addHomeModel.create({
                email:req.user,
                placeName,
                cityName
            });
            return res.status(201).json({message:addAddress});
        }
        return res.status(401).json({message:"Credentials not matched"})

        
    } catch (error) {
        return res.status(400).json({message:error});
    }
});

module.exports = userRouter;