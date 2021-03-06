
const router = require('express').Router();
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
router.get('/friend/unfriend', homeController.unfriendRequest);

router.post('/search',authCheck, homeController.searchPeople);
router.get('/search/:id',authCheck, homeController.searchPeopleById);



module.exports = router;