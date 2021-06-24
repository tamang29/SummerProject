
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : String,
    googleId : String
},{ timestamps : true});


const User = new mongoose.model('User' , userSchema);

module.exports = User;