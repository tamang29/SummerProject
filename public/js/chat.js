const socket = io.connect();


$(function(){
    let chatwin = $("#chat-window");
    chatwin.scrollTop(chatwin.height());
    const userid = $("#selecteduser").data('userid');
    //  socket.on('messageReceived', (messageObj)=>{
    //      if(userid != null && messageObj.from == userid){
    //          you.innerHTML += 
    //      }
    //     feedback.innerHTML = '';
    //     output.innerHTML += '<p><strong>' + data.handle +':' +'</strong>'+ data.message + '</p>';
    // })

    $('#send').on('click', function(){
        const userid = $("#selecteduser").data('userid');
        const message = $('#message').val();
        
        
        if(message == ''){
            return false;
        }
        const me = $(".whole").append('<li id="me"><p class="my-1"><span><strong>'+ message +'</strong></span></p></li>');
        chatwin.scrollTop(chatwin.height());
        
        $.ajax({
            url : '/chat/sendmessage',
            type : "POST",
            data : {userid : userid, message : message},
            dataType: "JSON",
            success:function(data){
                $('#message').val('');
            }
        })
    })

})



//Query DOM







    // btn.addEventListener('click', function(){
    //     if(message.value == ''){
    //         return false;
    //     }
    //     me.innerHTML += '<p class="my-1"><span><strong>' + handle.value +':' +'</strong>'+ message.value + '</span></p>'

    //     let userid = document.getElementById("user").dataset.userid;
        
    //     var request = new XMLHttpRequest();
    //     var url = "/chat/sendMessage";
    //     request.open("POST", url, true);
    //     request.setRequestHeader("Content-Type", "application/json");
    //     request.onreadystatechange = function () {
    //         if (request.readyState === 4 && request.status === 200) {
    //             var jsonData = JSON.parse(request.response);
    //             console.log(jsonData);
    //         }
    //     };



    //     var data = JSON.stringify({"message": message.value, "id": userid, "me": "true"});


    //     request.send(data);






    //     // socket.emit('chat', {
    //     //     message : message.value,
    //     //     handle : handle.value,

    //     // })
    // })

    // message.addEventListener('keypress', function(){
    //     socket.emit('typing', handle.value);
    // })


   

    // //Listen for events

    // socket.on('chat', (data)=>{
    //     feedback.innerHTML = '';
    //     output.innerHTML += '<p><strong>' + data.handle +':' +'</strong>'+ data.message + '</p>';
    // })

    // socket.on('typing',(data)=>{
    //     feedback.innerHTML = '<p><em>' + data +' is typing ....</em></p>';
    // })