const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,lowercase:true,required:true},
    password:{type:String,required:true,minLength:6},
    dateCreated:{type:Date,default:Date.now()},
    avatar:{public_id:{type:String,required:true},
            url:{type:String,required:true}},
    role:{type:String,default:"user",required:true},//kullanıcımı admin mi
    resetPasswordToken:String,
    resetPasswordExpire:Date,
            
    },{timestamps:true})
module.exports=mongoose.model('User',userSchema)

