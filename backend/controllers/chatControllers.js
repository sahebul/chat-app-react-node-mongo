const expressAsyncHandler = require("express-async-handler");
const Chats = require('../models/chat');
const Users = require("../models/users");
const accessChat = expressAsyncHandler(async(req,res)=>{
        // res.send(req.user._id);
        const {userId}=req.body;
        if(!userId){
                console.log("no user found to chat");
                return res.sendStatus(400);
        }
        let isChat=await Chats.find({
                isGroup:false,
                $and:[
                        { chatUsers : {$elemMatch:{$eq:req.user._id}}},
                        { chatUsers : {$elemMatch:{$eq:userId}}}
                ]
        }).populate("chatUsers","-password")
        .populate("lastMessage");

        isChat = await Users.populate(isChat,{
                path:"lastMessage.sender",
                select:"name email"
        })
        

        //if chat is not exist create a new chat
        if(isChat.length){
                res.send(isChat[0]);
        }else{
                let chatData={
                        chatName:"sender",
                        isGroup:false,
                        chatUsers:[req.user._id,userId],
                };
                try{
                        const createdChat= await Chats.create(chatData);
                        const newChat=await Chats.findOne({_id:createdChat._id}).populate("chatUsers","-password");
                        res.status(200).send(newChat);
                }catch(error){
                        res.status(400)
                        throw new Error(error.message); 
                        console.log(error);
                }
        }
       
        // if(!req.chatName ){

        // }
})
const fetchChat = expressAsyncHandler(async(req,res)=>{
        try{
                // Chats.find({chatUsers:{$elemMatch:{$eq:req.user._id}}})
                // .populate('chatUsers',"-password")
                // .populate('groupAdmin',"-password")
                
                // .sort({updatedAt:-1})
                // .then(async(result)=>{
                //         result= await Users.populate(result,{
                //                 path:'lastMessage',
                //                 select:'name email'
                //         });
                //         res.status(200).send(result);
                // });
                var chatlist= await Chats.find({chatUsers:{$elemMatch:{$eq:req.user._id}}})
                .populate('chatUsers','-password')
                .populate('groupAdmin',"-password")
                .sort({updatedAt:-1})
                .populate('lastMessage')
                chatlist = await Users.populate(chatlist,{
                        path:'lastMessage.sender',
                        select:'name email'
                })
                res.status(201).send(chatlist);
        }catch(error){
                res.status(400)
                throw new Error(error.message); 
        }
})
const createGroup=expressAsyncHandler(async(req,res)=>{
        if(!req.body.users || !req.body.name){
                return res.status(400).send({message:"Please Fill all the fields"});
        }

        let users = JSON.parse(req.body.users);
        if(users.length < 2){
                return res.status(400).send({message:"Atleast two member should be there"});
        }
        //adding logged user to users
        users.push(req.user);
        try{
        const groupChat= await Chats.create({
                chatName:req.body.name,
                chatUsers:users,
                isGroup:true,
                groupAdmin:req.user
        })
         
        const fullGroupChat=await Chats.findOne({_id:groupChat._id})
        .populate("chatUsers","-password")
        .populate("groupAdmin","-password");

        res.status(200).send(fullGroupChat);

        }catch(error){

        }
})
const renameGroup=expressAsyncHandler(async(req,res)=>{
        const {chatId,chatName}=req.body;

        const updateGroup= await Chats.findByIdAndUpdate(chatId,{
                chatName
        },{
                new:true // it return new records
        }
        )
        .populate("chatUsers","-password")
        .populate("groupAdmin","-password");

        if(!updateGroup){
                res.status(400);
                throw new Error("Unable to update group name. Please try again.")
        }else{
                res.send(updateGroup);
        }
})


const addToGroup=expressAsyncHandler(async(req,res)=>{
        const {chatId,userId}=req.body;
        const check=await Chats.find({ _id:chatId,
                chatUsers:{$elemMatch:{$eq:userId}}
        })
        
        console.log(check);
        if(check.length > 0){
                res.status(400);
                throw new Error("User already a member of the group")
        }else{
                const add= await Chats.findByIdAndUpdate(chatId,{
                        $push:{chatUsers:userId}
                },{
                        new:true // it return new records
                }
                )
                .populate("chatUsers","-password")
                .populate("groupAdmin","-password");
        
                if(!add){
                        res.status(400);
                        throw new Error("Unable to add group member. Please try again.")
                }else{
                        res.send(add);
                }
        }
       
})


const removeFromGroup=expressAsyncHandler(async(req,res)=>{
        const {chatId,userId}=req.body;

        //check for group admin
        //TODO
        const check=await Chats.find({
                chatUsers:{$elemMatch:{$eq:userId}}
        })
        
        const removed= await Chats.findByIdAndUpdate(chatId,{
                $pull:{chatUsers:userId}
        },{
                new:true // it return new records
        }
        )
        .populate("chatUsers","-password")
        .populate("groupAdmin","-password");

        if(!removed){
                res.status(400);
                throw new Error("Unable to update group member. Please try again.")
        }else{
                res.send(removed);
        }
       
})
module.exports={accessChat,fetchChat,createGroup,renameGroup,addToGroup,removeFromGroup}