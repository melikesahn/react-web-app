const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const bookSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    firstPrice:{
        type:Number,
        required:true

    },category:{
        type : String,
        required:true
    },
    images:[
        {
            public_id:{
                type:String,
                required: true

            },
            url:{
                type:String,
                required: true
                }
        }

    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    reviews: [
    {
        
        name:{
            type:String,
            required:true
        },
        comment:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },

    }
    ]
},{timestamps:true});
module.exports=mongoose.model('Book', bookSchema)