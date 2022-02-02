const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const authCheck = (req, res , next) => {
    if(!req.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
};

router.get('/',authCheck,(req, res)=>{
    res.redirect(`/room/${req.user.id}`)
})

router.get('/:subject/:room',authCheck, (req, res)=>{
    res.render('room', {roomId : req.params.room, title: 'video', user: req.user ,subject:req.params.subject})
})

module.exports = router;