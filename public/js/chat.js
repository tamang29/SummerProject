const socket = io();



$(function(){
    //chat window 
    let chatwin = $("#chat-window");
    chatwin.scrollTop(chatwin.height());
    //session username
    const username = $("#username").val();
    //message sent from other
    let you = $("#you").val();
    //the session user
    const sender = $("#userId").val();
    //user selected for chat
    const userid = $("#selecteduser").data('userid');
  
    const groupid  = $("#selectedgroup").data('userid');
  //feedback or notification of typing field
    let feedback = $("#feedback").val();

    // $("#message").on('keypress',function(){
    //     socket.emit('typing', {sender, receiver:userid});
    // })

    // //get typing notification
    // socket.on('typing', (data)=>{
    //     if(data.receiver == sender && userid!= null ){
    //          $("#feedback").html('<p><em>' + data.sender +' is typing ....</em></p>');
    //          chatwin.scrollTop(chatwin.height());
    //     }
    // })

    //realtime get message
    socket.on('private message', (data)=>{
        if(data.receiver == sender && userid== data.sender){

             you = $(".whole").append('<li id="you"><p class="my-1"><span><strong>'+ data.message +'</strong></span></p></li>');
             
        }
    })
    socket.on('group message', (data)=>{
        if(data.groupid == groupid && data.sender != sender){
            you = $(".whole").append('<li id="you"><p class="my-1"><span><strong>'+ data.message +'</strong></span><h6><small>'+data.username+'</small></h6></p></li>');
        }
    })

    $("#message").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#send").click();
        }
    });
    $('#send').on('click', function(){
        if(userid!=null){
        let message = $('#message').val();
        console.log(message)
        // message = urlify(message);
        
        if(message == ''){
            return false;
        }
        

        socket.emit('private message' , {sender,receiver:userid, message});
        
       
        const me = $(".whole").append('<li id="me"><p class="my-1"><span><strong>'+ message +'</strong></span></p></li>');
        chatwin.scrollTop(chatwin.height());
        
        $('#message').val('');


        $.ajax({
            url : '/chat/sendmessage',
            type : "POST",
            data : {userid : userid, message : message},
            dataType: "JSON",
            success:function(data){
                
            }
        })
        }
        if(groupid!=null){
            let message = $('#message').val();
            if(message == ''){
                return false;
            }
            socket.emit('group message', {sender,groupid,username, message});
            const me = $(".whole").append('<li id="me"><p class="my-1"><span><strong>'+ message +'</strong></span><h6><small>'+username+'</small></h6></p></li>');
            chatwin.scrollTop(chatwin.height());
            
            $('#message').val('');

            $.ajax({
                url : '/chat/sendgroupmessage',
                type: "POST",
                data : {groupid:groupid ,username:username, message: message},
                dataType: "JSON",
                success:function(data){
                   
                }

            })
           
        }
    })



    $(this).on('click', '#join', function(e){
               const roomid = $(this).val();
           console.log('hello');

         let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
         width=0,height=0,left=0,top=0`;
        
         open(`${roomid}`, 'test', params);
    })
    
    //   $("#join").on('click', function(){
    
    //   })
      
    // function urlify(text) {
    //     var urlRegex = /(http?:\/\/[^\s]+)/g;
        
    //     return text.replace(urlRegex, function(url) {
    //       return '<a href="' + url + '">' + url + '</a>';

    //     })
    //     // or alternatively
    //     // return text.replace(urlRegex, '<a href="$1">$1</a>')
    //   }

})




//Query DOM
// let message = document.getElementById('message');
//     handle = document.getElementById('handle');
//     btn = document.getElementById('send');
//     output = document.getElementById('output');
//     feedback = document.getElementById('feedback');



//     btn.addEventListener('click', function(){
//         socket.emit('chat', {
//             message : message.value,
//             handle : handle.value,

//         })
//     })

//     message.addEventListener('keypress', function(){
//         socket.emit('typing', handle.value);
//     })


   

//     //Listen for events

//     socket.on('chat', (data)=>{
//         feedback.innerHTML = '';
//         output.innerHTML += '<p><strong>' + data.handle +':' +'</strong>'+ data.message + '</p>';
//     })
   

    // socket.on('typing',(data)=>{
    //     feedback.innerHTML = '<p><em>' + data +' is typing ....</em></p>';
    // })
