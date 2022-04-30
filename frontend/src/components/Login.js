import { FormLabel, Input, VStack, FormControl, InputGroup, InputRightElement, Button,useToast } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import {useHistory} from 'react-router-dom';
import axios from 'axios';
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const toast = useToast()
    const history=useHistory();
    const handleSubmit=async()=>{
     // console.log(email,password);
      if(!email || !password){
        toast({
          title: 'Alert',
          description: "Please fill the required field",
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
      }else{
        setIsLoading(false);
        try{
          const config={
            'Content-Type':'application/json'
          }
          const data={
            email:email,
            password:password
          }
          const user=await axios.post('/api/user/login',data,config);
  
          toast({
            title: 'Login Successfull',
            // description: "Please fill the the required field",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          localStorage.setItem('userdata',JSON.stringify(user.data))
          setIsLoading(false);
          history.push('/chats');
  
        }catch(error){
         
          toast({
            title: 'Error ',
            description: error.response.data.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          setIsLoading(false);
        }
        // setIsLoading(true);
      }
    }
    return (
      <VStack spacing="5px">
       
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
                  <Input type={ show ? "text":"password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                  <InputRightElement width="4.5rem">
                      <Button h='1.7rem' size='sm' onClick={()=>setShow(!show)}>
                          {show ? 'Hide':'Show'}
                      </Button>
                  </InputRightElement>
          </InputGroup>
          
        </FormControl>
  
       
  
        <Button colorScheme="blue" width="100%" 
        isLoading={isLoading}
        onClick={handleSubmit}
        >
            Login
        </Button>
  
      </VStack>
    );
}
