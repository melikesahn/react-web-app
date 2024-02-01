const express=require('express');
const { createUser, loginUser, logOutUser, forgotPassword, resetPassword, userDetail } = require('../controllers/user.js');
const { authenticationMid } = require('../middleware/auth.js');
const router=express.Router();

router.post('/createUser',createUser)
router.post('/loginUser',loginUser)
router.get('/logOutUser',logOutUser)
router.post('/forgotPassword',forgotPassword)
router.post('/reset/:token',resetPassword)
router.get('/me',authenticationMid,userDetail)

module.exports=router