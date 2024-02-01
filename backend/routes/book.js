const express=require("express");
const {allBooks,detailBooks,createBooks,deleteBooks,updateBooks,createReview,adminBooks}=require('../controllers/book.js');
const { authenticationMid, roleChecked } = require("../middleware/auth.js");

const router =express.Router();

router.get('/books',allBooks);
router.get('admin/books',authenticationMid,roleChecked("admin"),adminBooks);
router.get('/books/:id',detailBooks);
router.post('/book/new',authenticationMid,createBooks);
router.post('/book/newReview',authenticationMid,createReview);
router.delete('/books/:id',authenticationMid,deleteBooks);
router.put('/books/:id',authenticationMid,updateBooks);
    

module.exports=router;