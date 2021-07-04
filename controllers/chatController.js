const User = require('../models/User');
const mongoose = require('mongoose');


const getFriendList = (req, res) =>{

    User.findOne({_id : req.user.id})
    .then((user)=>{
        res.render('chat', {title: 'Chat', user:user});
    })
    .catch((err)=>{
       if(err) throw err
    })
    
}

const getChat = (req, res)=>{
    const userid = req.params.id;
    User.findOne({_id : userid})
    .then((user)=>{
        res.render('chat', {title: 'Chat', user:req.user ,selectedUser :user});
    })
    .catch(err=>{
        if(err) throw err;
    })
    
}

const saveMessage = (req, res)=>{
    const userId = mongoose.Types.ObjectId(req.user.id.trim());
    const postdata = req.body;
    const sentTo = mongoose.Types.ObjectId(postdata.userid.trim());
    User.update({
        $and: [{
            "_id": userId
        }, {
            "friendList._id" : sentTo
        }]
    }, {
        $push: {
            "friendList.$.inbox":{
                
                "message" : postdata.message,
                "from": userId,
                "sent" : new Date().getTime()
            }
        }
    },function(err , user){
        if(err) throw err;
        else{
            User.update({
                $and: [{
                    "_id": sentTo
                }, {
                    "friendList._id" : userId
                }]
            }, {
                $push: {
                    "friendList.$.inbox":{
                       
                        "message" : postdata.message,
                        "from": userId,
                        "sent" : new Date().getTime()
                    }
                }
            },function(err, user){
                if(err) throw err;
                else {res.send({statusCode: 200})}
            })
        }
    })

}


module.exports = {
    getFriendList,
    getChat,
    saveMessage
}