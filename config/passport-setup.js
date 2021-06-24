const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const env = require('dotenv').config();
const User = require('../models/User');

passport.use(
    new GoogleStrategy({
    //option for google strategy
    callbackURL : '/auth/google/redirect',
    clientID : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,

    }, (accessToken , refreshToken , profile , cb) => {
        //passport callback function
        const usermodel = new User({
            username : profile.displayName,
            googleId : profile.id
        });
        
            // check if user already exists in our own db
            User.findOne({googleId: profile.id})
            .then((currentUser) => {
                    if(currentUser)
                    {
                        // already have this user
                        console.log('user is: ', currentUser);
                        // do something
                    } 
                    else 
                    {
                        // if not, create user in our db
                        usermodel.save().then((newUser) => {
                            console.log('created new user: ', newUser);
                            // do something
                        });
                    
                
                    }
                })
            .catch((err)=>{
                console.log(err);
            })
        
    }
))