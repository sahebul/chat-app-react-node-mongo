const express=require('express');
const { accessChat,fetchChat,createGroup,renameGroup,addToGroup,removeFromGroup } = require('../controllers/chatControllers');
const { auth } = require('../middleWare/authMiddleWare');
const { route } = require('./userRoutes');
const router=express.Router();

router.route("/").post(auth,accessChat);
router.route('/').get(auth,fetchChat);
router.route('/creategroup').post(auth,createGroup)
router.route('/renamegroup').put(auth,renameGroup)
router.route('/addtogroup').put(auth,addToGroup)
router.route('/removegroup').put(auth,removeFromGroup)

module.exports=router;