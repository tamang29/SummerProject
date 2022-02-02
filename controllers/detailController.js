const User = require('../models/User');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
var crypto = require("crypto"); 
const Meeting = require('../models/Meeting');

const getInstructors = (req, res ,next) =>{



    User.find({accountType: 'instructor'},(err,allusers)=>{
        res.render('instructor', {title : 'Instructor', user: req.user , allusers: allusers})
   });

    
}
const getStudents = (req, res ,next) =>{

    Meeting.find({},(err,allmeetings)=>{
        User.find({},(err,allusers)=>{
            res.render('student', {title : 'Students', user: req.user , allusers: allusers,allmeetings:allmeetings})
       });
    })

    

    
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
    
   users.push('614774de021c544d081ecc12');

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
                
                res.send({statusCode:200, msg : 'Group created successfully'})
                
            }
            else{
                res.send({error: 'Group name exists'})
            }
        })
        // Meeting.findOneAndUpdate(
        //     {subject:groupname},
        //     {
        //         "members": users
        //     },function(err){
        //         if(err) throw err;
        //         else{
        //             res.send({statusCode:200, msg : 'Group created successfully'})
        //         }
        //     }
        //     )
   

   // res.send({statusCode: 200})
}
const getMeetings = (req, res, next) => {
    User.find(
        {},
        (err, allusers)=>{
            Meeting.find({},
                (err, meetings)=>{
                    res.render('meetings', {title: 'Meeting',user:req.user, allusers:allusers, meetings:meetings});
                })
           
        })
   
}
const addMeetings = (req, res ,next) =>{
    const  {subject, instructor, instructorid, starttime , startT, endtime, endT } = req.body;
   
    let errors = [];
    if(errors.length > 0) {
        res.render('meetings', {
           errors,
           title: 'Meeting',
           user: req.user
        })
     }
     else{
        const newMeeting = new Meeting({
            instructorid: instructorid,
            subject: subject,
            instructor : instructor,
            starttime : starttime,
            startT : startT,
            endtime: endtime,
            endT: endT,
            
            
         })
        
         Meeting.findOne({subject: subject})
                .then((meeting)=>{
                    if(meeting){
                        res.send({error:"Meeting name exists"})
                    }else{
                        newMeeting.save()
                        .then((meeting)=>{
                           
                            res.send({statusCode: 200, msg:"Meeting insertion success"})
                        })
                        .catch((err)=>{
                            if(err) throw err;
                            res.send({error:"Error"})
                        })
                    }
                })

       
     }
   
    
   
}
const getSingleMeeting = (req, res ,next) =>{
    const id = req.body.id;
   

    Meeting.findOne({_id: id})
        .then((meet)=>{
            
            res.send({statusCode:200 , meetdetail: meet})
        })
        .catch(err=>{
            if (err) throw err;
        })
}
const editMeetings = (req, res, next)=>{
  
    let errors = [];
    
    if(errors.length > 0) {
        res.render('meetings', {
           errors,
           title: 'Meeting',
           user: req.user
        })
     }else{
        
        Meeting.findOneAndUpdate(
            {_id:req.body.meetingid},
            {
                subject: req.body.editsubject,
                instructor: req.body.editinstructor,
                starttime: req.body.editstarttime,
                startT : req.body.editstartT,
                endtime: req.body.editendtime,
                endT : req.body.editendT
            })
            .then((meeting)=>{
               
                    res.send({statusCode: 200, msg:"Meeting edit success"})
               
            })
            .catch(err=>{
                if(err) throw err;
                res.send({error:"Error"})
            })
           
         }
            
    
}
const deleteMeetings = (req, res)=>{
    const id = req.query.deleteid;
    Meeting.deleteOne({_id:id})
            .then((meeting)=>{
                res.send({statusCode:200})
            })
            .catch((err)=>{
                if(err) throw err;
            })
}
const recordAttendance = (req, res)=>{
    const userid = req.body.id;
    const roomid = req.body.roomid;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const subjectname = req.body.subject;
    // User.findOneAndUpdate(
    //     {_id: userid},
    //     {"attendance.roomid": roomid},
    //     {
    //         $push:{
    //             attendance:{
    //                 present:{
    //                     time: new Date().getTime(),
    //                     attended: true
    //                 }
    //             }
    //         }
    //     },
    //     function(err,result){
    //        if(err) throw err;
    //        if(!result){
              
    //        }
    //        else{
    //         res.send({statusCode:200})
    //        }
    //     }
    // )
     User.findOneAndUpdate(
       {_id: userid},

        {
            $push:{
                attendance: {
                    "roomid": roomid,
                    "subject":subjectname,
                    "time": new Date().getTime(),
                    "attended":true
                
                }
            }
        },
        (function(err, user){
            if(err) throw err;
            
        })
     )


    Meeting.findOneAndUpdate(
     
       {subject: subjectname},
        {
            $push:{
                attendance: {
                    "roomid": roomid,
                    "students":{
                        "studentid": userid,
                        "studentname":firstname+" "+lastname,
                        "time": new Date().getTime(),
                        "attended":true
                    }
                }
            }
        },
        {returnOriginal : false},
        
        function(err){
            if (err) throw err;
            else{
                res.send({statusCode:200})
            }
        }

    )
}



module.exports = {
    getInstructors,
    getStudents,
    approveInstructor,
    cancelInstructor,
    createGroup,
    getMeetings,
    addMeetings,
    editMeetings,
    getSingleMeeting,
    deleteMeetings,
    recordAttendance
}