const User = require('../models/User');
const mongoose = require('mongoose');

const searchPeople = (req ,res, next)=>{
    const name = req.body.search;
    
    User.find({$or: [{username:name.toLowerCase()} , {email : name} ]})
        .then((user)=>{
            
            res.render('search-result', {result: user , user: req.user});
        })
        .catch((err)=>{
            res.send(err);
        })
}


const sendRequest = (req, res ,next) =>{
    //request receiving user ie ammita gole
   const userId = req.query.to;
   //reqest sender
   

   const requestReceiver = mongoose.Types.ObjectId(userId.trim());
    const senderId = mongoose.Types.ObjectId(req.user.id.trim());

   
   let doc = User.findOneAndUpdate({_id: requestReceiver}, 
    { $push: 
        {
            friendList: {
                "_id": senderId,
                "username": req.user.username,
                "profileImage": req.user.thumbnail,
                "status": "pending",
                "sentByMe": false,
                
            },
            notification : {
                "_id": senderId,
                "type": "friend request",
                "content":"You received friend request from " +req.user.username,
                "profileImage": req.user.thumbnail,
                "createdAt": new Date().getTime(),
                
            }
        }
    },
    {returnOriginal : false},
    function(err, user){
        if(err) throw err;
        else{
            
            User.findOneAndUpdate({_id: req.user._id},
                { $push: 
                    {
                        friendList: {
                            "_id": user.id,
                            "username": user.username,
                            "profileImage": user.thumbnail,
                            "status": "pending",
                            "sentByMe": true,
                            
                        }
                    }
                },
                function(err, user){
                    if(err) throw err;
                    
                }
                )
        }
    });

     res.send({statusCode:200});

   }

   const deleteRequest = (req, res ,next) =>{
       //user that you sent friend request to
        const cancelid = req.query.cancelid;
        const cancelid_obj = mongoose.Types.ObjectId(cancelid.trim());
        const userId = mongoose.Types.ObjectId(req.user.id.trim());
        
      User.findOneAndUpdate(
            {_id : req.user.id},
            {
                $pull:{
                    friendList: {_id: cancelid_obj}
                }
            },
            function(err, user){
                if(err) throw err;
                else {
                    User.findOneAndUpdate(
                        {_id: cancelid},
                        {
                            $pull:{
                                friendList: {_id: userId},
                                notification: {userId: req.user.id}
                            }
                        },
                        function(err , user){
                            if(err) throw err;
                            
                        });
                }
            });

       
        console.log("deleted");
        
            res.send({statusCode: 200});
        
        
   }

   const confirmRequest = (req, res ,next) =>{
    
        const confirmid = req.query.id;
        const useri = mongoose.Types.ObjectId(req.user.id.trim());
        const confirmid_obj = mongoose.Types.ObjectId(confirmid.trim());
        console.log(req.user.username);
        console.log(req.user.id);
        console.log('amita', confirmid);
        User.updateOne({

            $and: [{
                "_id" : useri
            },{
                "friendList._id" : confirmid_obj
            }]
        }, {
            $set : {
                "friendList.$.status": "accepted"
            }
        },function(err, user){
            if(err) res.send(err);
            else{
                User.updateOne({
                    $and: [{
                        "_id" : confirmid_obj
                    }, {
                        "friendList._id": useri
                    }]
                }, {
                    $set :{
                        "friendList.$.status" : "accepted"
                    }
                },function(err, user){
                    if(err) {res.send(err);}
                    else{res.send({statusCode: 200});}
                }
                )
            }
        }

        )
            
       
   }





module.exports= {
    sendRequest,
    searchPeople,
    deleteRequest,
    confirmRequest
}