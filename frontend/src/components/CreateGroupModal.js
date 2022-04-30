import React,{useState} from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    FormControl,
    Box,
    Text,
    useToast,
  } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider';
import { CloseIcon} from "@chakra-ui/icons";
import axios from 'axios';
import { UserListItem } from './users/UserListItem';
const CreateGroupModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupName, setGroupName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user,chats,setChats,setSelectedChat} = ChatState();
    const toast = useToast();
    const handleCreateGroup=async()=>{
        if(groupName && selectedUsers){
            const input={
                name:groupName,
                users:JSON.stringify(selectedUsers.map(u=>u._id))
            }
            setLoading(true)
           try{
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} =await axios.post('/api/chat/creategroup',input,config);
            console.log(data);
            setChats([data,...chats]) // add on top
            setSelectedChat(data)
            onClose()
            toast({
               
                description: "New Group chat is created",
                status: "success",
                duration: 9000,
                isClosable: true,
                // position: "top-left",
              });

           }catch(error){
              
            setLoading(false)
            toast({
                title: "Error ",
                description: error.response.data.message ?? "Unable to create group" ,
                status: "error",
                duration: 9000,
                isClosable: true,
                // position: "top-left",
              });
              return;
           }
        }else{
            toast({
                title: "Error ",
                description: "Please enter group name",
                status: "error",
                duration: 9000,
                isClosable: true,
                // position: "top-left",
              });
              return;
        }
       
    } 
    const handleUser=(userToadd)=>{
        if(selectedUsers.includes(userToadd)){
           // alert("Allready user added");
        }else{
            setSelectedUsers([...selectedUsers,userToadd]);
        }

    }
    const removeSelectedUser=(userToRemove)=>{
        if(selectedUsers.includes(userToRemove)){
            const u=selectedUsers.filter(item=>item._id !=userToRemove._id);
            setSelectedUsers(u);
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
    return (
        <>
        <span onClick={onOpen}>{children}</span>
             <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <FormControl>
                    <Input placeholder="Group Name" mb={3} onChange={(e)=>setGroupName(e.target.value)}/>
              </FormControl>
              <FormControl>
                    <Input placeholder="Search user" onChange={(e)=>handleSearch(e.target.value)}/>
               </FormControl>
               <Box d='flex'>
               {
                   selectedUsers ?.map(user=>{
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
              
               {
                   loading ? (<div>Loading ....</div>):(
                    searchResults?.slice(0,4).map((user)=>{
                          return( <UserListItem user={user} key={user._id} handleClick={()=>handleUser(user)}/>)
                       })
                   )
                
               }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreateGroup}>
              Create Group
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export default CreateGroupModal
