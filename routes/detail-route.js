const router = require('express').Router();
const detailController = require('../controllers/detailController');
const authCheck = (req, res , next) => {
    if(!req.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
};

const adminCheck = (req, res, next)=>{
    if(req.user.accountType == 'admin'){
        next();
    }
    else{
        res.redirect('/');
    }
}

router.get('/instructors', authCheck,adminCheck, detailController.getInstructors);
router.get('/instructors/approve', authCheck,adminCheck, detailController.approveInstructor);
router.get('/instructors/cancelapproval', authCheck,adminCheck, detailController.cancelInstructor);
router.get('/students', authCheck, detailController.getStudents);
router.post('/creategroup', authCheck,adminCheck, detailController.createGroup);

router.get('/meetings',authCheck, detailController.getMeetings);
router.post('/meetings/add',authCheck, detailController.addMeetings);
router.post('/meetings/getsingle',authCheck, detailController.getSingleMeeting);
router.post('/meetings/edit',authCheck, detailController.editMeetings);
router.get('/meetings/delete',authCheck, detailController.deleteMeetings);

router.post('/meetings/attendance/insert',authCheck, detailController.recordAttendance);

module.exports = router;
