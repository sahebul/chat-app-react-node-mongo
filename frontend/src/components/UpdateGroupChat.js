import { ViewIcon,CloseIcon } from "@chakra-ui/icons";
import { IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,Box,Text,Input,FormControl, InputGroup, filter, useToast
 } from "@chakra-ui/react";
 import axios from 'axios';
import { UserListItem } from './users/UserListItem';
import React,{useEffect, useState} from "react";
import { ChatState } from "../Context/ChatProvider";

const UpdateGroupChat = ({ fetchAgain, setFetchAgain,fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const {selectedChat,user,setSelectedChat} =ChatState();
  const toast=useToast()
const isGroupAdmin=()=>{
      if(selectedChat.groupAdmin._id === user._id){
        return true;
      }else{
        return false;
      }
}
  const removeSelectedUser=async(userToRemove)=>{
    if(userToRemove._id !==user._id && !isGroupAdmin()){
      toast({
        // title: "Error ",
        description: "Only group admin can remove" ,
        status: "error",
        duration: 9000,
        isClosable: true,
        // position: "top-left",
      });
      return;
    }
    try {
      const config={
          headers:{
              Authorization:`Bearer ${user.token}`
          }
      }
        const {data}=await axios.put(`/api/chat/removegroup`,{chatId:selectedChat._id,userId:userToRemove._id},config);
        userToRemove._id === user._id ? setSelectedChat(): setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
    } catch (error) {
        console.log(error)
    }
  }
  const handleAddUserToGroup=async(userToAdd)=>{
    if(!isGroupAdmin()){
      toast({
        // title: "Error ",
        description: "Only group admin can add user" ,
        status: "error",
        duration: 9000,
        isClosable: true,
        // position: "top-left",
      });
      return;
    }

    if(!selectedChat.chatUsers.includes(userToAdd)){
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
              const {data}=await axios.put(`/api/chat/addtogroup`,{chatId:selectedChat._id,userId:userToAdd._id},config);
              setSelectedChat(data);
              setFetchAgain(!fetchAgain);
          } catch (error) {
              alert(error.response.data.message);
            //   console.log( JSON.stringify( error))
          }
        // const u=selectedChat.chatUsers.filter(item=>item._id !=userToRemove._id);
        // setSelectedUsers(u);
    }
  }
  const handleUpdateGroupName=async()=>{
      if(!groupName){
        return;
      }
      if(!isGroupAdmin()){
        toast({
          // title: "Error ",
          description: "Only group admin can update the group name" ,
          status: "error",
          duration: 9000,
          isClosable: true,
          // position: "top-left",
        });
        return;
      }
      try {
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
          const {data}=await axios.put(`/api/chat/renamegroup`,{chatId:selectedChat._id,chatName:groupName},config);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
      } catch (error) {
          console.log(error)
      }
  }
  const handleSearch=async(searchTerm)=>{
    if(searchTerm){
        setLoading(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        try{
            const {data} = await axios.get(`/api/user?search=${searchTerm}`,config);
            setSearchResults(data);
            setLoading(false);
        }catch(error){
            setLoading(false);
            console.log("Error");
        }
        
    }
       


}
  const handleExit=()=>{

  }
  return (
    <div>
    <IconButton d={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
    

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box d='flex'>
               {
                   selectedChat.chatUsers && selectedChat.chatUsers.filter((u)=>u._id !=user._id).map(user=>{
                       return(<Box 
                        p={2}
                        d="flex"
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={'md'}
                        borderColor="#ccc"
                        borderWidth="1px"
                        m={1}
                        key={user._id}>
                            <Text pr={2}>{user.name}</Text>
                            <CloseIcon w={2} h={3} pt="2px"  onClick={()=>{removeSelectedUser(user)}} />
                        </Box>)
                   })
               }
               </Box>

               <FormControl mb={2}>
                   <InputGroup>
                   <Input placeholder="Group Name" defaultValue={selectedChat.chatName} onChange={(e)=>setGroupName(e.target.value)} />
                   <Button colorScheme="blue" ml={2} onClick={()=>handleUpdateGroupName()}>Update</Button>
                   </InputGroup>
                   
               </FormControl>
               <FormControl>
                   <Input placeholder="Users" onChange={(e)=>handleSearch(e.target.value)}/>
               </FormControl>
               {
                   loading ? (<div>Loading ....</div>):(
                    searchResults?.slice(0,4).map((user)=>{
                          return( <UserListItem user={user} key={user._id} handleClick={()=>handleAddUserToGroup(user)}/>)
                       })
                   )
                
               }
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" colorScheme="red" onClick={()=>removeSelectedUser(user)}>Exit Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChat;
