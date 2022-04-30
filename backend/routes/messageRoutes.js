const express= require('express');
const { sendMessage,allMessages } = require('../controllers/messageControllers');
const {auth} =require('../middleWare/authMiddleWare');
const router=express.Router();

router.route('/').post(auth,sendMessage)
router.route('/:chatId').get(auth,allMessages)
module.exports=router;