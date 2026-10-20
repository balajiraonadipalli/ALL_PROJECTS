const bcrypt = require("bcryptjs");
const express = require("express");    
const jsonwebtoken = require("jsonwebtoken");
const User = require("./UserModel");

const Router = express.Router();    
const SECRET_KEY = "Balu";

Router.post("/register",async (req,res)=>{
    const {username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({error:"Usernama adn password are required"})
    }
    try {
        const hashp = await bcrypt.hash(password,15);
        User.create(username,hashp,(err,result)=>{
            if(err){
                if(err.code === "ER_DUP_ENTRY"){
                    return res.status(400).json({error:"Username already exists"});
                }
                return res.status(500).json({error:err.message})
            }
            res.status(201).json({message:"User registered Successfully"});
        })
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"});
    }
});


Router.post("/Login",async(req,res)=>{
    const {username,password} = req.body;
    console.log(req.body)
    if(!username || !password){
        return res.status(400).json({error:"Username and password are required"});
    }
    try {
        User.findByUsername(username,async(err,results)=>{
            console.log(username)
            if(err) return res.status(500).json({error:err.message});
            if(results.length === 0) {
                return res.status(400).json({error:"Invalid credentials"});
            }
            const user  = results[0];
            console.log(user);
            const match = await bcrypt.compare(password.toString('utf8'), user.password);
            console.log(typeof password, typeof user.password,match);
            if(match){
                const token = jsonwebtoken.sign({id:user.id},SECRET_KEY,{expiresIn:"1h"});
               return res.status(200).json({message:"Login Successful",token})
            }
            return res.status(400).json({error:"Invalid credentials"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
});


module.exports = Router;