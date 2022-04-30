const mongoose=require('mongoose');

const chatSchema=mongoose.Schema({
    chatName:{type:String,trim:true},
    isGroup:{type:Boolean,default:false},
    chatUsers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users",
        },
    ],
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
    },
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Messages",
    }
},{
    timestamps:true
});
const Chat=mongoose.model('Chats',chatSchema);
module.exports=Chat;