const express = require('express');
const app = express();
const authRoute = require('./routes/auth-route');
const mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');

const env = require('dotenv').config();

//setup view engine
app.set('view engine' , 'ejs');

//setup static link
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static('public'));

//setup connection to database
mongoose.connect(process.env.DB_URL ,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('connection successful');
    })
    .catch((err)=>{
        console.log(err);
    });


app.get('/', (req, res) =>{
    res.render('index', {title: 'Home Page'})
    
});


//setup routes
app.use('/auth', authRoute);



app.listen(3000, () =>{
    console.log('App is listening to 3000.');
});