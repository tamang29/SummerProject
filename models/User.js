
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname : String,
    lastname : String,
    username : String,
    email: String,
    password: String,
    googleId : String,
    facebookId: String,
    accountType: String,
    accountApprove: Boolean,
    friendList: [
        {
            
            "username": {type: String},
            "profileImage": {type: String},
            "status": {type:String},
            "sentByMe": {type: Boolean},
            "inbox": {type:Array}
        }
    ],
    notification: [
        {
            
            "type":{type: String},
            "content":{type: String},
            "profileImage": {type: String},
            "createdAt": {type: Date},
            
        },
    ],
    thumbnail : String
},{ timestamps : true});


const User = new mongoose.model('User' , userSchema);

module.exports = User;