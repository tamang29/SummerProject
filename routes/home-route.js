
const router = require('express').Router();
const User= require('../models/User');
const homeController = require('../controllers/homeController');

const authCheck = (req, res , next) => {
    if(!req.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
};



router.get('/',authCheck, (req,res) => {
    res.render('index', {title: 'Home Page', user: req.user});
    
})

router.get('/home',authCheck, (req,res) => {
    res.redirect('/');
})

router.get('/friend/sendrequest', homeController.sendRequest);
router.get('/friend/deleterequest', homeController.deleteRequest);
router.get('/friend/confirmrequest', homeController.confirmRequest);

router.post('/search',authCheck, homeController.searchPeople);



module.exports = router;