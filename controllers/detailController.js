const User = require('../models/User');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
var crypto = require("crypto"); 

const getInstructors = (req, res ,next) =>{



    User.find({accountType: 'instructor'},(err,allusers)=>{
        res.render('instructor', {title : 'Instructor', user: req.user , allusers: allusers})
   });

    
}
const getStudents = (req, res ,next) =>{



    User.find({},(err,allusers)=>{
        res.render('student', {title : 'Students', user: req.user , allusers: allusers})
   });

    
}
const approveInstructor = (req, res , next) =>{
    const userid = req.query.instructor;

    User.findOneAndUpdate({_id : userid}, 
        {accountApprove : true} , 
        function(err, user){
            if(err) throw err;
            else{
                console.log(user);
                res.send({statusCode: 200})
            }
    })
        

    

}
const cancelInstructor = (req, res , next) =>{
    const userid = req.query.instructor;

    User.deleteOne({_id : userid})
        .then((user, err)=>{
            if(user){
                res.send({statusCode: 200})
            }
            else{
                throw err;
            }
        })

   
    
}
const createGroup = (req, res, next) =>{
    const users = req.body.allusers;
    const groupname = req.body.groupname;
    var newgroupid = crypto.randomBytes(12).toString('hex');
    
   

    User.findOne({"groups.name":groupname})
        .then((user)=>{
            if(!user){
                users.forEach(single=>{
                    User.updateOne(
                        {_id: single},
                        {
                            $push:{
                                groups:{
                                    "_id": newgroupid,
                                    "name": groupname,
                                    "members":users,

                                }
                            }
                        },
                        function(err, user){
                            if(err) throw err;
                            
                        })
                        
                })
                res.send({statusCode:200})
            }
            else{
                res.send({msg: 'group name exists'})
            }
        })
   

   // res.send({statusCode: 200})
}


module.exports = {
    getInstructors,
    getStudents,
    approveInstructor,
    cancelInstructor,
    createGroup
}