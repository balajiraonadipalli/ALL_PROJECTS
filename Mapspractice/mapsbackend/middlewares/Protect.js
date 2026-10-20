const jwt = require("jsonwebtoken");

const UserModel = require("../models/UserModel");

 const Protect = async(req,res,next) =>{
    let token;
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token,process.env.JSON_TOKEN);
            console.log(decode);
            const user = await UserModel.findById(decode.id).select("-password");
            req.user = user;
            console.log(user);
            if(!user){
              return  res.status(401).json({message:"User not FOund"});
            }
            next();
        }
    } catch (error) {
        return res.status(401).json({message:"not Authorized token failed"});
    }
    if(!token){
        return res.status(400).json({message:"token not found"});
    }
}

module.exports = Protect;