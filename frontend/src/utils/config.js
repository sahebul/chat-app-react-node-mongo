export const getSenderName = (logedUser, chatUsers) => {
  return chatUsers[0]._id === logedUser._id
    ? chatUsers[1].name
    : chatUsers[0].name;
};
export const getSenderFull = (logedUser, chatUsers) => {
  return chatUsers[0]._id === logedUser._id ? chatUsers[1] : chatUsers[0];
};

export const isSameSender = (message, m, i, userId) => {
  return (
    i < message.length - 1 &&
    (message[i + 1].sender._id !== m.sender._id ||
      message[i + 1].sender._id === undefined) &&
    message[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (message, m, i, userId) => {
  if(i < message.length - 1 &&
    message[i + 1].sender._id === m.sender._id &&
    message[i].sender._id !== userId){
    return 33;
  }
  else if(
    (i < message.length - 1 &&
    message[i + 1].sender._id !== m.sender._id  &&
    message[i].sender._id !== userId ) || 
    (i === message.length-1 && message[i].sender._id !== userId)
  )
  return 0;
  else
   return "auto";
 
};
export const isSameUser=(message,m,i)=>{
  return(
    i > 0 && message[i-1].sender._id === m.sender._id
  )
}
