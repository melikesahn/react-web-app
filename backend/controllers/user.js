const User=require('../models/user.js')
const jwt = require("jsonwebtoken");
//const jwt = require('bcrypt.js')
const bcrypt = require("jsonwebtoken")
const cloudinary=require('cloudinary').v2;
const crypto = require('crypto');
const { error } = require('console');
const nodemailer = require('nodemailer');

const  createUser=async(req,res)=>{

    const avatar= await cloudinary.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:130,
        crop:"scale"

    })


    const {name,email,password}=req.body;
    const user =await User.findOne({email})
    if(user){
        return res.status(500).json({message:"Email is already in use!!!"})
    }
    //Hashing the password using bcrypt
    const hashedPassword=await bcrypt.hash(password,10)
    if(password.lenght<6){
        return res.status(500).json({message:"Şifre en az 6 karakter olmalı."})
    }
    const  newUser=await User.create({name,email,password:hashedPassword,
        avatar:{public_id:avatar.public_id,url:avatar.secure_url}
    }); 
    const  token = await jwt.sign({id:newUser._id},"SECRETTOKEN",{expiresIn:"1hr"});
    const cookieOptions={httpOnly:true, 
                        expires:new Date(Date.now()+5*24*60*60*1000)}
    res.status(201).cookie("token",token,cookieOptions).json({newUser,token})
    

}

const  loginUser=async(req,res)=> {
    const {email,password}=req.body;
    const  user=User.findOne({email})
    if(!user){
        return res.status(500).json({message:'The email does not exist.'})
    }
  
    const comparePassword =await bcrypt.compare(password,user.password)
    if(!comparePassword){
        return res.status(500).json({message:'Invalid Password'})
    }

    const  token = await jwt.sign({id: user._id},"SECRETTOKEN",{expiresIn:"1h"});
    const cookieOptions={httpOnly:true, 
                        expires:new Date(Date.now()+5*24*60*60*1000)}
    res.status(200).cookie("token",token,cookieOptions).json({user,token})
}
const  logOutUser=async(req,res)=> {
    const cookieOptions={httpOnly:true, 
        expires:new Date(Date.now())}
    res.status(200).cookie("token",null,cookieOptions).json({message:'Logged out successfully!'})

}
const  forgotPassword=async(req,res)=>{
    
    const user=await User.findOne({email:req.body.email});
    if(!user){
        res.status(500).json({message:"Böyle bir kullanıcı bulunamadı"})
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire=new Date.now()+5*60*1000;
    await user.save({validateBeforeSave:false});

    const passwordUrl=`${req.protocol}://${req.get('host')}/reset/${resetToken}`
    const  message=`Parolanızı sıfırlamak için lütfen aşağıdaki linke tıklayınız.\n\n ${passwordUrl}\n\n `+
                'Bu link 1 saat sonra geçerlilikini dolacak';
                try{
                    const transporter = nodemailer.createTransport({
                        port: 465,
                        service:"gmail",               
                        host: "smtp.gmail.com",
                           auth: {
                                user: 'youremail@gmail.com',
                                pass: 'password',
                             },
                        secure: true,
                        });
                        const mailData = {
                            from: 'youremail@gmail.com',  // sender address
                              to: req.body.email,   // list of receivers
                              subject: 'şifre sıfırlama',
                              text: message
                             
                            };

                        await transporter.sendMail(mailData);
                        return res.status(200).json({message:`E-Posta adresinize gönderildi.`})

                }catch(err){
                    
                    user.resetPasswordToken=undefined;
                    user.resetPasswordExpire= undefined;
                    await user.save({validateBeforeSave:false});
                    return res.status(500).json({message:error.message})
                }

}
const  resetPassword=async(req,res) =>{

    const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user =await  User.findOne({resetPasswordToken ,resetPasswordExpire:{$gt:Date.now()}

    })

    if(!user){
        return res.status(500).json({message: "geçersiz token...!"})  ;
        
    }

    user.password=req.body.password;
    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;

    await user.save();

    const token  = jwt.sign({id: user._id},"SECRETTOKEN",{expiresIn: "1h"});

    const cookieOptions={httpOnly:true, 
        expires:new Date(Date.now()+5*24*60*60*1000)}
        res.status(201).cookie("token",token,cookieOptions).json({user,token})


}

const  userDetail=async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    res.status(201).cookie("token",token,cookieOptions).json({user})

    req.user=user;
}


module.exports={createUser,loginUser,logOutUser,forgotPassword,resetPassword,userDetail}
