import React,{useEffect} from "react";
import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel,Divider  } from "@chakra-ui/react";
import Login from "../components/Login";
import { Signup } from "../components/Signup";
import {useHistory}  from 'react-router-dom'
export default function Home() {
  const history=useHistory();
  useEffect(()=>{
     const userInfo= JSON.parse(localStorage.getItem("userdata"));
   
      if(userInfo){
          history.push('/chats');

      }
  },[history])

  return (
    <Container maxW="md" centerContent bg="blackAlpha.600" p={10}>
      
      <Box bg="white" w="100%" p={4}>
        <Text fontSize="2xl"  align="center" p={4} fontWeight="semibold" color="blue">
          Chat App
        </Text>
        <Divider orientation='horizontal' mb={4}/>
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}
