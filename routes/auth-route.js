const express = require('express');
const router = express.Router();
const passport = require('passport');



//auth with login
router.get('/login', (req, res) => {
    res.render('login', {title: 'Login'})
})

//auth logout
router.get('/logout', (req, res) => {
    //handle logout with passport
    res.send('logging out');
})

//auth with google

router.get('/google', passport.authenticate('google',{
    scope :['profile']
}));

router.get('/google/redirect',passport.authenticate('google') ,(req , res) => {
    res.send('reached callback');
})


module.exports = router;