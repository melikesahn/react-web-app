const User =require('../models/user.js');
const jwt= require("jsonwebtoken");

const authenticationMid=async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(500).json({message:'You must be logged in to view this resource.'})
    }

    const decodeData= jwt.verify(token,"SECRETTOKEN");
    if(!decodeData){
        return  res.status(500).json({message:"Invalid token"});
    }

    req.user=await User.findById(decodeData.id)
    next();
}
const roleChecked=(...roles)=>{
    return (req,res,next)=> {
        if (!roles.includes(req.user.role)) {
            return res.status(500).json({ message: `Authentication failed! You
            are not authorized to perform this action.` });
          } 
          
          next();
    }

}

module.exports={authenticationMid,roleChecked}