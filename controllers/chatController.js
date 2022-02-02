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
                
            })
        }
    })

}
const saveGroupMessage = (req, res, next)=>{
    const userid = mongoose.Types.ObjectId(req.user.id.trim());
    const postdata = req.body;
    const sentToGroup = mongoose.Types.ObjectId(postdata.groupid.trim());




    User.find({"groups._id" : sentToGroup})
        .then((user)=>{
            if(user){
                User.updateMany(
                    {"groups._id" : sentToGroup},
                    {
                        $push :{
                            "groups.$.inbox" :{
                                "message": postdata.message,
                                "from": userid,
                                "username": postdata.username,
                                "sent": new Date().getTime()
                            },
                           
                        }
                    },
                    function(err, user){
                        if (err) throw err;
                        
                    })
            }
        })
        .catch(err=>{
            if(err) throw err;
        })
    
    if(postdata.reminder){
        User.find({"groups._id" : sentToGroup})
        .then((user)=>{
            if(user){
                User.updateMany(
                    {"groups._id" : sentToGroup},
                    {
                        $push :{
                            "groups.$.reminder" :{
                                "message": postdata.username +" started meeting.",
                                "from": userid,
                                "sent": new Date().getTime()
                            },
                           
                        }
                    },
                    function(err, user){
                        if (err) throw err;
                        else{
                            res.send({statusCode:200})
                        }
                    })
            }
        })
        .catch(err=>{
            if(err) throw err;
        })
    }
}
const getGroupChat = (req, res,next)=>{
    const groupid = req.params.id;
    var totalgroup =[];
    User.findOne({_id: req.user.id })
        .then((group)=>{
            
            group.groups.forEach(result=>{
                if(result._id == groupid){
                    res.render('chat', {title: 'Chat', user:req.user ,selectedGroup: result});
                }
            })
           
        })
        .catch(err=>{
            if(err) throw err;
        })
}


module.exports = {
    getFriendList,
    getChat,
    saveMessage,
    getGroupChat,
    saveGroupMessage
}