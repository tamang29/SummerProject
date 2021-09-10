const express = require('express');
const app = express();
const authRoute = require('./routes/auth-route');
const homeRoute = require('./routes/home-route');
const chatRoute = require('./routes/chat-route');
const roomRoute = require('./routes/room-route');
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

//video chat room routes
app.use('/room', roomRoute);







const httpServer = http.createServer(app);

//const httpsServer = https.createServer(options , app);
const io = socket(httpServer);
let clients = [];
// let userId ;
// let roomId ;

io.on('connection', (socket)=>{
   
    socket.on('storeClientInfo', (data)=>{
        let clientInfo = new Object();
        clientInfo.customId = data;
        clientInfo.clientId = socket.id;
        clients.push(clientInfo);
        console.log("connected socket:" +socket.id);
        // console.log(clients);

    })

    socket.on('disconnect', function (data) {

        for( var i=0, len=clients.length; i<len; ++i ){
            var c = clients[i];

            if(c.clientId == socket.id){
                clients.splice(i,1);
                break;
            }
        }


    });

  

    socket.on("private message", (data)=>{
      io.emit('private message', data);
    })

    socket.on('chat', (data)=>{
        io.sockets.emit('chat',data);
    })

    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing',data);
    })

    //for video chat room


    socket.on('join-room', (roomId, userId , username)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId , username)

        socket.on('disconnecting', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId ,username)
        })
    })
    socket.on('connection-request',(roomId,userId,username)=>{
    io.to(roomId).emit('new-user-connected',userId,username);
    })

    // socket.on('userIdReceived', (id , room) => {
    //     userId = id
    //     roomId = room
    //   });

})

httpServer.listen(3000, function() {
    console.log('localhost started on 3000')
});