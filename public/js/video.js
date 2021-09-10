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




// socket.emit('join-room', ROOM_ID , USER_ID);

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream =>{
    addVideoStream(myVideo, stream)

    myPeer.on('call', call=>{
        
        call.answer(stream)
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream,call)
        })
    })
    
    
    
    socket.on('new-user-connected',(userId,username) =>{
        if(userId!=myPeer.id){
            console.log("New user: "+username);
            otherLabel.innerHTML = username
            connectToNewUser(userId,stream,username);
        }
    })
    const roomid = ROOM_ID;
    socket.emit('connection-request',roomid,myPeer.id,USER_NAME);
    
})

socket.on("user-disconnected", (userId , username)=>{
    if(userId != myPeer.id){
        video.remove()
        console.log("User disconnected:" +username)
        otherLabel.remove()
    }
    
});



function connectToNewUser(userId , stream){
    
    const call =  myPeer.call(userId , stream, { metadata: { userName: USER_NAME } });
   //console.log(call.metadata.userName)
    
    call.on('stream', userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })

    call.on('close', ()=>{
        video.remove()
    })

}


function addVideoStream(newvideo , stream ,call){
    const obj = call;
    //console.log(obj)
    if(obj){
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