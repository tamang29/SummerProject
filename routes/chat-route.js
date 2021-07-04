const router = require('express').Router();
const chatController = require('../controllers/chatController');
    
router.get('/' , chatController.getFriendList);
router.get('/:id' ,chatController.getChat);
router.post('/sendmessage', chatController.saveMessage);
    

module.exports = router;