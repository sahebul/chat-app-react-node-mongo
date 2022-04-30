import React, { useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import Loader from "./Loader";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { UserListItem } from "./users/UserListItem";
import { getSenderName } from "../utils/config";
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

const SideDrawer = () => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { user,setSelectedChat,chats,setChats,notification, setNotification  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userdata");
    history.push("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Error ",
        description: "Please type something",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error  ",
        description: "Unable to fetch",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };
  
  
  const accessChat=async(user_id)=>{
    if (!user_id) {
        toast({
          title: "Error ",
          description: "Please select chat user",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }
      setLoadingChat(true);
      try {
        const config = {
          headers: {
            "Content-Type":'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`/api/chat`,{userId:user_id}, config);
        //append the chat if exist
        if(!chats.find((c)=>c._id === data._id)){
           setChats([data, ...chats]);
        }
        setLoadingChat(false);
        setSelectedChat(data);
        onClose();
        console.log("chat in here"+JSON.stringify(chats));
      } catch (error) {
        console.log(JSON.stringify(error));
        setLoadingChat(false);
        toast({
          title: "Error  ",
          description: "Unable to access chat",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom-left",
        });
        return
  }}
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        p="5px 10px 5px 10px"
        w="100%"
      >
        <Tooltip label="Seacrh User" hasArrow placement="bottom-start">
          <Button variant="ghost" leftIcon={<SearchIcon />} onClick={onOpen}>
            <Text d={{ base: "none", md: "flex" }} fontSize="sm" px="10px">
              {" "}
              Search User
            </Text>
          </Button>
        </Tooltip>
        

        <div>
          <Menu>
            <MenuButton>
            <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Notifications"}
             

              {
               notification && notification.map((notif)=>{
                  return(
                    <MenuItem  key={notif._id} onClick={()=>{
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n)=>n!=notif));
                    }}>
                   {notif.chat.isGroup ? `New message in ${notif.chat.chatName}`:`New Message from ${getSenderName(user,notif.chat.chatUsers)}`}
                 </MenuItem>
                  )
                })
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              variant="none"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar size="sm" cursor="pointer" name={user.name}>
                {" "}
              </Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box d="flex">
              <Input
                placeholder="Type here..."
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button ml="10px" onClick={handleSearch} isLoading={loading}>
                Go
              </Button>
            </Box>
            {loading ? (
              <Loader />
            ) : (
              searchResult &&
              searchResult.map((user) => {
                  return <UserListItem key={user._id} user={user} handleClick={()=>accessChat(user._id)}/>
              })
            )}
          </DrawerBody>
            {loadingChat && <Spinner ml="auto" d="flex"/>}
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
