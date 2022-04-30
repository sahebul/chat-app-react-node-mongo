const asyncHandler = require("express-async-handler");
const Users =require('../models/users');

const {generateToken} =require('../config/utils')
const registerUser=asyncHandler(async(req,res)=>{
    
    const {name, email, password, profilePic}=req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    //check if user is already exits
    const userExists=await Users.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("Already user exists");
    }
 //ccreae user
    const user= await Users.create({
        name,
        email,
        password,
        profilePic
    })
    console.log(user);
    if(user){
        res.status(201).json(
            {
                _id:user._id,
                name:user.name,
                email:user.email,
                profilePic:user.profilePic,
                token:generateToken(user._id)
            }
        )
    }else{
        res.status(400);
        throw new Error("Unable to create user");
    }
})

const authUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    const user=await Users.findOne({email});
    if(user && (await user.matchPassword(password)) ){
        res.status(201).json({
            
            _id:user._id,
            name:user.name,
            email:user.email,
            profilePic:user.profilePic,
            token:generateToken(user._id)
        })
    }else{
        res.status(401);
        throw new Error("Inavlid credentials");
    }
})
//api/user?search=text
const allUsers=asyncHandler(async(req,res)=>{
        const searchTerm=req.query.search ? {
           $or:[
               {name : { $regex: req.query.search, $options:"i"}},
               {email: {$regex:req.query.search, $options:"i"}}
           ] 
        }  : {}

        const users=await Users.find(searchTerm).find({_id:{$ne:req.user.id}});
        res.send(users);
      // console.log(users);
})
module.exports={registerUser,authUser,allUsers};