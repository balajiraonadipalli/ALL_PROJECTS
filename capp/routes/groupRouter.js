const express = require("express");
const Group = require("../models/GroupModel");
const { protect,isAdmin } = require("../middleware/authMiddleware");

const groupRouter = express.Router();

groupRouter.post("/",protect,isAdmin,async (req,res)=>{
    try {
        const {name,description} = req.body;
        const group = await Group.create({
            name,
            description,
            admin:req.user._id,
            members:[req.user._id],
        });
        const populatedGroup = await Group.findById(group._id).populate("admin","username email").populate("members","username email");
        
        res.status(201).json({populatedGroup});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

groupRouter.get("/",protect,async (req,res)=>{
    try {
        const groups = await Group.find().populate("admin","username email").populate("members","username email");
        res.json(groups);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

groupRouter.post("/:groupId/join",protect,async (req,res)=>{
    try {
        const group = await Group.findById(req.params.groupId);
        console.log(group);
        if(!group){
            return res.status(404).json({message:"Group not Found"});
        }
        if(group.members.includes(req.user._id)){
            return res.status(400).json({message:"Already a member of this Group"});

        }
        group.members.push(req.user._id);
        await group.save();
        res.json({message:"Successfully joined the Group"});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});

groupRouter.post("/:groupId/leave",protect,async (req,res)=>{
    try{
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return res.status(404).json({message:"Group Not found"});
        }
        if(!group.members.includes(req.user._id)){
            return res.status(404).json({message:"You are not the member of this group"});
        }
        group.members = group.members.filter((memberId)=>{
            return memberId.toString() !== req.user._id.toString();
        })
        await group.save();
        console.log(group.members);
        res.json({message:"Successfully left the group"});
    }catch(error){
        res.status(400).json({message:error.message});
    }
})


module.exports = groupRouter;