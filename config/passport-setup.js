const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const env = require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');


passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser((id, done)=>{
    User.findById(id)
        .then((user)=>{
            done(null, user);
        })
});


//local registration or login
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false , {message: 'Email is not registered.'});
        }
        
       
        //Match Password
        bcrypt.compare(password, user.password, (err, isMatch)=>{
            if(err) throw err;

            if(isMatch){
                done(null, user);
            }
            else{
                done(null , false, {message: 'Incorrect password'});
            }
        })

           
        
      });
    })
  );

//Google Authentication Strategy
passport.use(
    new GoogleStrategy({
    //option for google strategy
    callbackURL : '/auth/google/redirect',
    clientID : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,

    }, (accessToken , refreshToken , profile , done) => {
        //passport callback function
        console.log(profile);
        const usermodel = new User({
            firstname : profile.name.givenName,
            lastname : profile.name.familyName,
            username : profile.displayName,
            email : profile._json.email,
            googleId : profile.id,
            thumbnail : profile._json.picture
        });
        
            // check if user already exists in our own db
            User.findOne({googleId: profile.id})
            .then((currentUser) => {
                    if(currentUser)
                    {
                        // already have this user
                        console.log('user is: ', currentUser);
                        done(null, currentUser);
                    } 
                    else 
                    {
                        // if not, create user in our db
                        usermodel.save()
                            .then((newUser) => {
                            console.log('created new user: ', newUser);
                            done(null, newUser);
                        });
                    
                
                    }
                })
            .catch((err)=>{
                console.log(err);
            })
        
    }
))

// Facebook strategy
passport.use(new FacebookStrategy({
    callbackURL : '/auth/facebook/redirect',
    clientID: process.env.CLIENT_FB_ID,
    clientSecret : process.env.CLIENT_FB_SECRET,

    }, (accessToken, refreshToken , profile , done)=>{
        const usermodel = new User({
            facebookId : profile.id,
            username : profile.displayName,
            
        });
        console.log(profile);
        User.findOne({facebookId: profile.id})
            .then((currentUser) => {
                    if(currentUser)
                    {
                        // already have this user
                        console.log('user is: ', currentUser);
                        done(null, currentUser);
                    } 
                    else 
                    {
                        // if not, create user in our db
                        usermodel.save()
                            .then((newUser) => {
                            console.log('created new user: ', newUser);
                            done(null, newUser);
                        });
                    
                
                    }
                })
            .catch((err)=>{
                console.log(err);
            })
    }
))