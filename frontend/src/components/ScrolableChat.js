import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../utils/config'
import {Tooltip,Avatar} from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'
const ScrolableChat = ({messages}) => {
    const {user} =ChatState()
    return (
        <ScrollableFeed>
            {
                messages && messages.map((m,i)=>(
                    <div style={{display:'flex'}} key={m._id}>
                        {(isSameSender(messages,m,i,user._id) || isLastMessage(messages,i,user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name = {m.sender.name}
                                />
                            </Tooltip>
                        )}
                        <span
                        style={{
                            backgroundColor: `${
                                m.sender._id === user._id  ? "#BEE3F8":"#a6d2e3"
                            }`,
                            borderRadius:'20px',
                            padding: "5px 15px",
                            maxWidth:"70%",
                            marginLeft:isSameSenderMargin(messages,m,i,user._id),
                            // marginTop:isSameUser(messages,m,i,user._id) ? 3 : 10,
                            marginTop:3,
                        }}
                        >
                            {m.content}
                        </span>
                        </div>
                ))
            }
        </ScrollableFeed>
    )
}

export default ScrolableChat
