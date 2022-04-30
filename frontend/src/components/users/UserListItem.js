import { Avatar, Box,Text } from '@chakra-ui/react'
import React from 'react'

export const UserListItem = ({user,handleClick}) => {
    return (
        <Box d="flex" p="10px" alignItems="center" onClick={handleClick} 
        cursor="pointer"
        _hover={{background:'#dadde3',color:'white'}}
        borderRadius="xl"
        > 
            <Avatar size="sm" />
            <Text pl="10px">{user.name}</Text>
        </Box>
    )
}
