const router = require('express').Router();
const chatController = require('../controllers/chatController');
    
const authCheck = (req ,res ,next) =>{
    if(!req.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
}

router.get('/' ,authCheck, chatController.getFriendList);
router.get('/:id' ,authCheck,chatController.getChat);
router.post('/sendmessage', chatController.saveMessage);
    

module.exports = router;