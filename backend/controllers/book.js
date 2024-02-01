const Book =require('../models/book.js');
const  BookFilter  = require('../utils/bookFilter.js');
const cloudinary=require('cloudinary').v2;

const allBooks = async(req,res)=>{
    const resultPage=10;
    const bookFilter=new BookFilter(Book.find(),req.query).search().filter().pagination(resultPage)
    const books =await bookFilter.query;
    res.status(200).json({
        books
    })
}

//adminin tüm ürünlere ulaşması
const adminBooks=async (req,res,next)=> {
    const books= await Book.find();
    res.status(200).json({
        books
    })

}

const detailBooks = async(req,res)=>{
    const book =await Book.findById(req.params.id);
    res.status(200).json({
        book
    })
}

//admin için  ekleme yapılmasını sağlayan fonksiyon
const createBooks = async(req,res)=>{
    let images=[];
    if(typeof req.body.images==="string"){
        images.push=(req.body.images);
    }else{
        images=req.body.images;
    }

    let allImage=[];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i],{folder:"Books"});
        allImage.push({public_id:result.public_id,url:result.secure_url})
    }

    req.body.images=allImage
    req.body.user= req.user.id

    const book =await Book.create(req.body);
    res.status(201).json({
        book
    })
}
const deleteBooks = async(req,res)=>{
    const book =await Book.findById(req.params.id);
    for(let i=0; i<book.length; i++){
        await cloudinary.uploader.destroy(book.images[i].public_id)
        
    }

    await book.remove();

    res.status(200).json({
        message:"Kitap silindi..."
    })
}
const updateBooks = async(req,res)=>{
    const book =await Book.findById(req.params.id);

    let images=[];
    if(typeof req.body.images==="string"){
        images.push=(req.body.images);
    }else{
        images=req.body.images;
    }
    if(images!==undefined){
        for(let i=0; i<book.length; i++){
            await cloudinary.uploader.destroy(book.images[i].public_id)
            
        }
    }

    let allImage=[];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i],{folder:"Books"});
        allImage.push({public_id:result.public_id,url:result.secure_url})
    }

    req.body.images=allImage

    book=await Books.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true})
    res.status(200).json({
        book
    })
}

const  createReview =async (req , res) =>{
    const{bookId,comment,rating}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        comment,
        rating:Number(rating)

    }
    const book=await Book.findById(bookId);
    book.reviews.push(review)

    let avg=0;
    book.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    book.rating=avg/book.reviews.length;
    await book.save({validateBeforeSave:false})
    res.status(200).json({
        message:'Yorum başarıyla eklendi...',
    })

}
module.exports={allBooks,detailBooks,createBooks,deleteBooks,updateBooks,createReview,adminBooks};