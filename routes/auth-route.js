const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../controllers/authController');


const authCheck = (req ,res ,next) =>{
    if(req.user){
        res.redirect('/');
    }
    else{
        next();
    }
}

//setup register route
router.get('/register',authCheck, (req, res)=>{
    res.render('register',{title: "Register",user: req.user});
})

//post register for new user
router.post('/register', authController.registerUser);


//auth with login
router.get('/login',authCheck, (req, res) => {
    res.render('login', {title: 'Login' , user: req.user})
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next);
  });

//auth logout
router.get('/logout', (req, res) => {
    //handle logout with passport
    req.logout();
    res.redirect('/auth/login');
})

//local


//auth with google

router.get('/google',authCheck, passport.authenticate('google',{
    scope :['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google',{ failureRedirect: '/auth/login'}) ,(req , res) => {
    res.redirect('/home');
})

// auth with facebook
router.get('/facebook',passport.authenticate('facebook'));

router.get('/facebook/redirect',passport.authenticate('facebook' ,{
    failureRedirect: '/auth/login'
}) ,(req,res)=>{
    res.redirect('/home');
});




module.exports = router;