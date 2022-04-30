import { FormLabel, Input, VStack, FormControl, InputGroup, InputRightElement, Button,useToast  } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import axios from 'axios';
import {useHistory} from 'react-router-dom';

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [pics,setPic]=useState('');
  const toast = useToast()
  const history=useHistory();
  const getImageDetails=(pic)=>{
    // curl https://api.cloudinary.com/v1_1/dwog0kn5g/image/upload -X POST --data 'file=<FILE>&timestamp=<TIMESTAMP>&api_key=<API_KEY>&signature=<SIGNATURE>'
      // setIsLoading(true);
      // if(pic === undefined){
      //   toast({
      //     title: 'Alert',
      //     description: "Please Upload an image",
      //     status: 'warning',
      //     duration: 9000,
      //     isClosable: true,
      //   })
      //   return;
      // }
      // if(pic.type === "image/jpeg" || pic.type==="image/png"){

      //   const data= new FormData();
      //   data.append('file',pic);
      //   // data.append('upload_preset','chat-app');
      //   data.append('cloud_name','dwog0kn5g');
      //   data.append('timestamp',Date.now());
      //   data.append('api_key','218145698812283');
      //   data.append('signature','_PY5uLoFbnV96UdHWKNZNKtR43k');
      //   fetch('https://api.cloudinary.com/v1_1/dwog0kn5g/image/upload',{
      //     method:'post',
      //     body:data
      //   }).then((res)=>res.json())
      //   .then(data=>{
      //     // setPic(data.url.toString());
      //     console.log(data);
      //     setIsLoading(false);
      //   }).catch(er=>{
      //     console.log(er);
      //     setIsLoading(false);
      //   })
      // }else{
      //   toast({
      //     title: 'Alert',
      //     description: "Please Upload an image",
      //     status: 'warning',
      //     duration: 9000,
      //     isClosable: true,
      //   })
      //   return;
      // }

  }
  const handleSubmit=async()=>{
    console.log(name,email,password);
    if(!name || !email || !password){
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
          name:name,
          email:email,
          password:password
        }
        const user=await axios.post('/api/user',data,config);

        toast({
          title: 'Registration Successfull',
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
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      </FormControl>
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

      <FormControl id="profile_pic">
        <FormLabel>Profile Picture</FormLabel>
        <Input type="file" p={1.5}
         accept='image/*' 
         onChange={(e) => getImageDetails(e.target.files[0])} />
      </FormControl>

      <Button colorScheme="blue" width="100%"  
        isLoading={isLoading}
        onClick={handleSubmit}
      >
          Sign Up 
      </Button>

    </VStack>
  );
};
