const express = require('express');
const app = express();
const authRoute = require('./routes/auth-route');
const homeRoute = require('./routes/home-route');
const chatRoute = require('./routes/chat-route');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const socket = require('socket.io');
const https = require('https');
const http = require('http');
const fs = require('fs');
const flash = require('connect-flash');
const session = require('express-session');



const env = require('dotenv').config();

//setup view engine
app.set('view engine' , 'ejs');
//post request 
app.use(express.urlencoded({ extended : true}));




//setup static link
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static('public'));

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }


//setup cookie in the browser
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [process.env.SESSION_COOKIE_KEY]
}));
// express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

  
//connect flash
app.use(flash());

//global varirable
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//setup passport
app.use(passport.initialize());
app.use(passport.session());

//setup connection to database
mongoose.connect(process.env.DB_URL ,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('connection successful');
    })
    .catch((err)=>{
        console.log(err);
    });


app.use('/', homeRoute);
//search route


//setup routes

app.use('/auth', authRoute);
app.use('/chat', chatRoute);
app.get('/login',(req, res) => {
    res.redirect('/auth/login');
})
// app.get('/auth/register',(req, res) => {
//     res.render('register');
// })
app.get('/maps', (req,res)=>{
    res.render('maps');
})








const httpServer = http.createServer(app);

//const httpsServer = https.createServer(options , app);
const io = socket(httpServer);



// io.on('connection', (socket)=>{
//     console.log('made connection to socket', socket.id);
    

//     socket.on('chat', (data)=>{
//         io.sockets.emit('chat',data);
//     })

//     socket.on('typing', (data)=>{
//         socket.broadcast.emit('typing',data);
//     })

// })

httpServer.listen(3000, function() {
    console.log('localhost started on 3000')
});