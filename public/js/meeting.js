
$(function(){
    $(this).on('click', '#startMeeting' ,function(e){
        const socket = io();
        const sender = $('#userId').val();
        const clickedBtn = $(this);
        const groupid = clickedBtn.closest('.meeting').find('#groupid').val();
        const groupname = clickedBtn.closest('.meeting').find('#groupname').val();
        //console.log(id)
       console.log(groupid)

        e.preventDefault();
        //let btnClicked = $(this);

        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=0,height=0,left=0,top=0`;
        
        open(`/room/${groupname}/${sender}`, 'test', params);

        let message = `http://localhost:3000/room/${groupname}/${sender}`
        const msg = `<button class='btn btn-success' type='submit' id='join' value=${message}>join room ${username}</button>`

        socket.emit('group message' , {sender,groupid,username, message:msg});

        $.ajax({
            url : '/chat/sendgroupmessage',
            type: "POST",
            data : {groupid:groupid ,username:username, message: msg, reminder:true},
            dataType: "JSON",
            success:function(data){
               
            }

        })
        
    })

    // function urlify(text) {
    //     var urlRegex = /(http?:\/\/[^\s]+)/g;
    //     return text.replace(urlRegex, function(url) {
    //       return `<a href onclick = 'joinroom()' > ${url} </a>`;
    //     })
    //     // or alternatively
    //     // return text.replace(urlRegex, '<a href="$1">$1</a>')
    //   }
      
      
      
})

