import React,{useState,useEffect} from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text,useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderName, getSenderFull } from "../utils/config";
import ProfileModel from "./ProfileModel";
import UpdateGroupChat from "./UpdateGroupChat";
import ScrolableChat from './ScrolableChat';
import axios from "axios";
import "./styles.css"
import Lottie from 'react-lottie';
import * as animationData from '../animation/typing.json'
import io from 'socket.io-client';
const ENDPOINT='http://localhost:5000';
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat,notification, setNotification } = ChatState();
  const toast=useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  //socket code
  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit('setup',user);
    socket.on("connected",()=>setSocketConnected(true));
    socket.on('typing',()=>setIsTyping(true));
    socket.on('stop typing',()=>setIsTyping(false));
  },[])
  useEffect(()=>{
    socket.on('message recieved',(newMessageRecieved)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
          if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        }else{

          setMessages([...messages,newMessageRecieved]);
        }
    })
  })
  // end of socket io

  useEffect(()=>{
      fetchMessages()
      selectedChatCompare=selectedChat;
  },[selectedChat])
  const fetchMessages=async()=>{
    if(!selectedChat) return;
    try {
      const config={
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
      setLoading(true);
      const {data} = await axios.get(`/api/message/${selectedChat._id}`,config);
      console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat",selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Ocuured while fetching messages',
        // description: "Please fill the the required field",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "top-left"
      })
    }
  }
  
  const sendMessage=async(e)=>{
    if(e.key === "Enter" && newMessage){
      socket.emit('stop typing',selectedChat._id);
      try {
          const config={
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${user.token}`
            }
          };
          setNewMessage("")
          const {data} = await axios.post('/api/message',{
            content:newMessage,
            chatId:selectedChat._id
          },config)
         
          socket.emit('new message',data)
          setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Unable to send a message',
          // description: "Please fill the the required field",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }
  }
  const typingHandler=(e)=>{
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing) {
      setTyping(true)
      socket.emit('typing',selectedChat._id);
    }

    let lastTypingTime= new Date().getTime();
    var timerLength=3000;
    setTimeout(()=>{
        var timenow=new Date().getTime();
       var  timediff= timenow -lastTypingTime;
        if(timediff >= timerLength && typing){
          socket.emit('stop typing',selectedChat._id);
          setTyping(false)
        }
    },timerLength)

  }
  return (
    <>
      {selectedChat ? (
        <>
          <Box
            pb={3}
            px={3}
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            w="100%"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            
            {!selectedChat.isGroup ? (
              <>
                {getSenderName(user, selectedChat.chatUsers)}
                <ProfileModel
                  user={getSenderFull(user, selectedChat.chatUsers)}
                ></ProfileModel>
              </>
            ) : (
              <>
              {selectedChat.chatName}
               <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}>{ selectedChat.chatName}</UpdateGroupChat>
              </>
             
            )}
          </Box>
          <Box 
          d="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg="#ccc"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
          >
              {
                loading ? (
                  <Spinner
                  size='xl'
                  w={10}
                  h={10}
                  alignSelf="center"
                  margin='auto'
                  />
                ):(
                  <div className="messages">
                    {/* messages */}
                    <ScrolableChat messages={messages}/>
                  </div>

                )
              }
              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping ? <div>
                   <Lottie options={defaultOptions}
                  style={{marginLeft:0,marginTop:10}}
              width={70}
              />
                </div> : <div></div>}
                <Input
                variant="filled"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
                 />
              </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text>Please click on user to start chat</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
