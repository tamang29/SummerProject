$(function(){
    $(this).on('click', '#startMeeting' ,function(e){
        e.preventDefault();
        //let btnClicked = $(this);

        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=0,height=0,left=0,top=0`;
        
        open('/room', 'test', params);
    })
})

