import React, { useEffect } from "react";
import { Box, useToast, Text, Button, Stack, Avatar, Divider } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import Loader from "./Loader";
import { PlusSquareIcon } from "@chakra-ui/icons";
import CreateGroupModal from "./CreateGroupModal";
import { getSenderName } from "../utils/config";
const MyChat = ({fetchAgain}) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
//   console.log("my chats::"+JSON.stringify(chats));
// let componentMounted = true;
  const toast = useToast();
  useEffect(() => {
    console.log("my chat is list called");
    fetchChat();
    // return ()=>{
    //     componentMounted=false;
    // }
  }, [fetchAgain]);
 
  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
     // if(componentMounted)
      setChats(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error  ",
        description: "Unable to fetch chat",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      border="1px"
      borderTopColor="#ccc"
      borderLeftColor="transparent"
      borderRightColor="transparent"
      borderBottomColor="transparent"
    >
      <Box d="flex" justifyContent="space-between" p={2}>
        <Text>My Chats</Text>
        <CreateGroupModal>

        
        <Button leftIcon={<PlusSquareIcon/>} bg="transparent">
          Create Group
        </Button>
        </CreateGroupModal>
      </Box>
      <Divider/>
      <Box>
        {chats ? (
          <Stack overflowY="scroll">
            {chats &&
              chats.map((chat) => {
                return (
                  <Box d="flex" alignItems="center" key={chat._id}
                  onClick={()=>setSelectedChat(chat)}
                  bg={selectedChat === chat ? "whitesmoke":'white'}
                  // color={selectedChat === chat ? "black":"black"}
                  borderRadius={'lg'}
                  px={3}
                  py={2}
                  >
                      <Avatar/>
                    <Text pl="10px">
                      {!chat.isGroup
                        ? getSenderName(user, chat.chatUsers)
                        : chat.chatName}
                    </Text>
                  </Box>
                );
              })}
          </Stack>
        ) : (
          <Loader />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
