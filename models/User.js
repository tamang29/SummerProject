
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
    groups: [
        {
            "name": {type: String},
            "members":{type:Array},
            "inbox": {type:Array},
            "reminder": {type:Array}
        }
    ],
    attendance:[
        {
            "roomid": {type:String},
            "subject":{type:String},
            "time": {type:Date},
            "attended":{type:Boolean}
        }
            
        
    ],
    
   

    
    thumbnail : String
},{ timestamps : true});


const User = new mongoose.model('User' , userSchema);

module.exports = User;