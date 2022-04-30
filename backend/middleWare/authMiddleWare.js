const asyncHandler = require('express-async-handler');
const jwt =require('jsonwebtoken');
const Users = require('../models/users');
const auth=asyncHandler( async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
                token=req.headers.authorization.split(" ")[1];
                const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
                // console.log(decodedToken);
                req.user= await Users.findById(decodedToken.id).select("-password")
                next()
        }catch(er){
            res.status(401);
            throw new Error("Not authorized")
            
        }
    }
    if(!token){
        res.status(401);
        throw new Error("Not authorized")
    }
   
   // return;
    
})

module.exports = {auth}