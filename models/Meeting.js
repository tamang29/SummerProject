const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
            "instructorid": {type: String},
            "subject": {type: String},
            "instructor": {type: String},
            "starttime": {type: String},
            "startT": {type: String},
            "endtime": {type: String},
            "endT": {type:String},
            members: {type:Array},
            attendance:[
                {
                "roomid": {type:String},
                "students":[ 
                    {
                    "studentid": {type:String},
                    "studentname":{type:String},
                    "time": {type:Date},
                    "attended":{type:Boolean}
                    }
                    ]
                }
            ],
        
        

},{timestamp:true}
);

const Meeting = new mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;