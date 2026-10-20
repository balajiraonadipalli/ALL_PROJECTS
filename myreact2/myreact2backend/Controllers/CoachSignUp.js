const CoachProfile = require("../models/CoachSignUp")

const CoachProfileCreation = async (req,res)=>{
    const {Name,dob,email,password,gender,speciality} = req.body;
    console.log(req.body);
    const existUser = await CoachProfile.findOne({email});
    console.log(existUser);
    if(!existUser){
        const user =  CoachProfile.create({
            Name,dob,email,password,gender,speciality
        })
        return res.json({message:existUser})
    }
    return res.json("User already exist");
}

const CoachLogin = async (req,res)=>{
    const {email,password} = req.body;
    console.log(req.body);
    const existUser = await CoachProfile.findOne({email});
    console.log(existUser);
    if(existUser!=null){
        return res.json({message:"User Logged Successfully"});
    }
    return res.json({message:"User DoesNot Exists"});
   
}

module.exports = {
    CoachProfileCreation,
    CoachLogin
}