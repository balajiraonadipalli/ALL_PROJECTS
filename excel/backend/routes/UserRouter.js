const express = require("express");
const User = require("../models/UserModel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/authenticateUser");

userRouter.post("/register",async (req,res)=>{
    try {
        const {userName,email,password} = req.body;
        console.log(req.body);
        const userexist = await User.findOne({email});
        if(userexist){
            return res.status(400).json({message:"User Already exists"});
        }

        const user = await User.create({
            userName,
            email,
            password,
        });
        if(user){
            res.status(201).json({
                _id:user._id,
                userName:user.username,
                email:user.email,
            });
        }
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
});

userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        console.log(user);
        if(user && (await user.matchPassword(password))){
            res.json({
                user:{
                    _id:user._id,
                    userName:user.userName,
                    email:user.email,
                    token:generateToken(user._id),
                }
            });

        }else{
            res.status(401).json({message:"Invalid Username or Password"})
        }
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});


// userRouter.get("/wishlist",protect,(req,res)=>{
//     return res.status(200).json({message:"Welcome to wishlist"});
// })


const generateToken = (id)=>{
    return jwt.sign({id},"Balaji",{
        expiresIn:'10d',
    });

};

module.exports = userRouter;