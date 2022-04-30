const express = require("express");
const dotenv = require("dotenv");
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes');
const chats = require("./data/data");
const mongoDBConnect = require("./config/db");
const {notFound,errorHandler} =require('./middleWare/errorHandlerMiddleWare');
const path = require('path');
dotenv.config();  
mongoDBConnect();
const app = express();
app.use(express.json()); //app only accept json data




app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

const __dirname1= path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname1,"/frontend/build")))
}else{
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.use(notFound);
app.use(errorHandler);

const server= app.listen(process.env.PORT || 5000, console.log("server is running on 5000"));

const io = require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:'http://localhost:3000'
  }
})
io.on('connection',(socket)=>{
  console.log("connected to socket.io");
//creating a room for user
  socket.on('setup',(userData)=>{
    socket.join(userData._id);
    console.log(userData._id)
    socket.emit('connected');
  })

  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("user joined room"+room);
  })

  socket.on('new message',(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;
    if(!chat.chatUsers) return console.log("chat.user is not define");
    chat.chatUsers.forEach(user => {
      if(user.id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit('message recieved',newMessageRecieved);
    });
  })

  socket.on('typing',(room)=>{
    socket.in(room).emit("typing")
  })
  socket.on('stop typing',(room)=>{
    socket.in(room).emit("stop typing")
  });

  socket.off("setup",()=>{
    console.log("User disconnected");
    socket.leave(userData._id)
  })
})