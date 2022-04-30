const mongoose=require('mongoose');

const model=mongoose.Schema({
   sender:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
   content:{type:String,trim:true},
   chat:{type:mongoose.Schema.Types.ObjectId,ref:'Chats'}
},{
    timestamps:true
});
const Messages=mongoose.model('Messages',model);
module.exports=Messages;