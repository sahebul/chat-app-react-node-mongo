const express=require("express");
const router=express.Router();
const {auth} =require('../middleWare/authMiddleWare');
const {registerUser,authUser,allUsers}=require('../controllers/userControllers'); 
router.route('/').post(registerUser)
router.post('/login',authUser)
router.route('/').get(auth,allUsers);
module.exports=router;