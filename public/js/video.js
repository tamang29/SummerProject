const socket = io();
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(USER_ID, {
    host: '/',
    port: '3001'
})

myPeer.on('open', id=>{
    socket.emit('join-room', ROOM_ID,id , USER_NAME);
})

socket.emit('userIdReceived', myPeer.id ,ROOM_ID);

const myDiv = document.createElement('div');
const myLabel = document.createElement('label');
myLabel.innerHTML = USER_NAME
myLabel.append("(you)")

const otherDiv = document.createElement('div');
const otherLabel = document.createElement('label');

const myVideo = document.createElement('video');
myVideo.setAttribute("id","me");
myVideo.muted = true;

const video = document.createElement('video');
var call;
var userid;
var username;



// socket.emit('join-room', ROOM_ID , USER_ID);

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream =>{
    addVideoStream(myVideo, stream)
    $(".mute").change(function() {
        if(this.checked) {
            stream.getAudioTracks()[0].enabled = false;
        }
        else{
            stream.getAudioTracks()[0].enabled = true;
        }
    })
    $(".video").change(function() {
        if(this.checked) {
            stream.getVideoTracks()[0].enabled = false;
        }
        else{
            stream.getVideoTracks()[0].enabled = true;
        }
    })

    $("#sharescreen").on('click',function(e){
       
        navigator.mediaDevices.getDisplayMedia({video: true})
        .then(screen=>{
            screen.getVideoTracks()[0].addEventListener('ended', () => {
                alert('stop sharing')
               
                myVideo.srcObject = stream
                connectToNewUser(userid,stream,call.metadata.username);
              });

        
            myVideo.srcObject = screen
            connectToNewUser(userid,screen,username);

            
        });
        
    })
    myPeer.on('call', call=>{
        
        call.answer(stream)
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream,call)
        })
    })
    
    
    
    socket.on('new-user-connected',(userId,username) =>{
        
        if(userId!=myPeer.id){
            console.log("New user: "+username);
            otherLabel.innerHTML = username;
            userid = userId;
           
            username = username;
            connectToNewUser(userId,stream,username);
        }
    })
    const roomid = ROOM_ID;
    socket.emit('connection-request',roomid,myPeer.id,USER_NAME);
    
})

//attendance event
$('#attendance').on('click', function(e){
    socket.emit("attendance event" , ROOM_ID);
})



socket.on("user-disconnected", (userId , username)=>{
    if(userId != myPeer.id){
        video.remove()
        console.log("User disconnected:" +username)
        otherLabel.remove()
    }
    
});



function connectToNewUser(userId , stream){
    
    call =  myPeer.call(userId , stream, { metadata: { userName: USER_NAME , userid : USER_ID} });
   
   
    call.on('stream', stream=>{
        addVideoStream(video,stream)
    })


    call.on('close', ()=>{
        video.remove()
    })

}


function addVideoStream(newvideo , stream ,call){
    const obj = call;
    //console.log(obj)
    if(obj){
        userid = obj.metadata.userid;
        username = obj.metadata.userName;
        console.log("Connected to:" +obj.metadata.userName)
        otherLabel.innerHTML = obj.metadata.userName
    }
    video.setAttribute("id","other")
    

    newvideo.srcObject = stream;
    newvideo.addEventListener('loadedmetadata', ()=>{
        newvideo.play();
    })


    if(newvideo.id == 'me'){
        myDiv.append(newvideo)
        myDiv.append(myLabel)
        videoGrid.append(myDiv)
    }
    else{
        otherDiv.append(video)
        otherDiv.append(otherLabel)
        videoGrid.append(otherDiv)
    }
    
}

function shareScreen(video,stream){
    const obj = call;
     if(obj){
         
        console.log("Connected to:" +obj)
        otherLabel.innerHTML = obj.metadata.userName
    }
    addVideoStream(video, stream, obj)
}