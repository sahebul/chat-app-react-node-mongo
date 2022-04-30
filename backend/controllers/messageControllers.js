const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const Messages = require("../models/messages");
const Users = require("../models/users");

const sendMessage=expressAsyncHandler(async(req,res)=>{
const {content,chatId} =req.body;
if(!content || !chatId){
    console.log("Invalid data");
    return res.sendStatus(400);
}

var newMessage={
    sender:req.user._id,
    content: content,
    chat: chatId
}
try {
    var message= await Messages.create(newMessage);
    message = await message.populate("sender","name profilePic")
    message = await message.populate('chat')
    message = await Users.populate(message,{
        path:"chat.chatUsers",
        select:"name profilePic email"
    });
    await Chat.findByIdAndUpdate(req.body.chatId,{
        lastMessage : message
    });
    res.json(message);
} catch (error) {
    res.status(400);
    throw new Error(error.message);
}
})

const allMessages = expressAsyncHandler(async(req,res)=>{
    try {
        const messages= await Messages.find({chat:req.params.chatId})
                                        .populate("sender","name email profilePic")
                                        .populate("chat")
            res.status(201).send(messages);
    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
})
module.exports={sendMessage,allMessages}