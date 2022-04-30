import React,{useState} from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer";
import MyChat from "../components/MyChat";
import ChatBox from "../components/ChatBox";
export default function Chats() {
const {user} =ChatState();
// console.log("loged user : "+JSON.stringify(user))
const [fetchAgain, setFetchAgain] = useState(false)
  return(
    <div style={{width:"100%"}}>
      { user && <SideDrawer/>}
      <Box d="flex"
      justifyContent="space-between"
      // p="10px"
      w="100%"
      h="91.5vh"
      >
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}
