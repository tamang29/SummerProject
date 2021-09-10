const User = require('../models/User');
const passport = require('passport');
const passportSetup = require('../config/passport-setup');
const bcrypt = require('bcrypt');

const registerUser = (req, res) => {

   const  {firstname, lastname, username , email, password, confirmpassword , accounttype} = req.body;
   let errors = [];

   if(!firstname || !lastname ||!username || !email || !password || !confirmpassword ||!accounttype){
      errors.push({msg: 'Please fill all the fields'});
   }
   if(password != confirmpassword){
      errors.push({msg: 'Password doesnot match'});
   }

   if(errors.length > 0) {
      res.render('register', {
         errors,
         firstname,
         lastname,
         email,
         title: 'Register',
         user: req.user
      })
   }
   else{
      //verification passed

      User.findOne({username: username})
            .then((user)=>{
               if(user){
                  errors.push({msg: 'Username is already registered'});
                  res.render('register', {
                     errors,
                     firstname,
                     lastname,
                     username,
                     email,
                     title: 'Register',
                     user: req.user
                  })
               }
            })
      User.findOne({email: email})
         .then((user)=>{
            if(user){
               //if user exists or email
               errors.push({msg: 'Email is already registered'});
               res.render('register', {
                  errors,
                  firstname,
                  lastname,
                  username,
                  email,
                  title: 'Register',
                  user: req.user
               })
            }
            else{
               //user doesnt exists or email
               const newUser = new User({
                  firstname: firstname,
                  lastname : lastname,
                  username : username,
                  email : email,
                  password: password,
                  accountType: accounttype,
                  accountApprove: false
               })

               bcrypt.genSalt(10,(err, salt)=>
                  bcrypt.hash(newUser.password, salt, (err,hash)=> {
                     if(err) throw err;

                     newUser.password = hash;
                     newUser.save()
                        .then((user)=>{
                           req.flash('success_msg','You are now registered and can log in.');
                           res.redirect("/auth/login");
                        })
                        .catch((err)=>{
                           res.send(err);
                        })
                  })
               )
            }


         })
      }



 
   /*const usermodel = new User(req.body);

   User.findOne({email: req.body.email})
      .then((currentUser)=>{
         if(currentUser){
            console.log('user exists in db: ', currentUser);
            res.redirect('/auth/register');
         }
         else{
            usermodel.save()
            .then((newUser) => {
            console.log('created new user: ', newUser);
            res.redirect('/auth/login');
        });
         }
         
      })
      */



}

module.exports = {registerUser}