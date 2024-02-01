const mongoose = require('mongoose');
const db =() => {
mongoose.connect('mongodb+srv://melsaahin:12345@cluster0.zhhb3wu.mongodb.net/', {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => {
console.log("mongoDB connected !!!!")
})
.catch((err) => {
console.log(err)
})
}
module.exports = db