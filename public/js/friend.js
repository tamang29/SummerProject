<script>
$(document).ready(function(){
        
    //send friend request
    $(this).on('click','#addfriend', function(e){
        e.preventDefault();
      
        let clickedBtn = $(this);
        //change button state to request sent
        $(this).attr('data-state','sent');

        //logged in user
        const userId = $("#userId").val();
        //sending request to user
        const userRequestId = $(this).data('id');

        //console.log("receiving user" ,userRequestId);
        
        $.ajax({
            url: '/friend/sendrequest',
            method : 'GET',
            data: {to: userRequestId, from: userId },

            success:function(data){
                if(data.statusCode == 200){
                    
                    clickedBtn.attr('disabled',true).html('Request Sent');
                    clickedBtn.closest('.add').find('.cancel').attr('hidden', false);
                    console.log('success');
                }

            },
            error: function(err){
                alert(err);
            }
        })


      
        
    } )

    //cancel friend request
    $(this).on('click', ' .cancel' , function(){

        let clickedBtn = $(this);
        const cancelid = $(this).data('cancel');

       
        $.ajax({
            url: '/friend/deleterequest',
            method: 'GET',
            data: {cancelid : cancelid},

            success:function(data){
                if(data.statusCode == 200){
                    clickedBtn.attr('hidden', true);
                    clickedBtn.closest('.add').find('.addfriend').attr('disabled', false).html('Add friend');
                }
                if(data.statusCode == 500){
                    alert('something went wrong please try again');
                }
            }
        })
    })

    //confirm friend request
    $(this).on('click', ' .confirm-request', function(){
        let clickedBtn = $(this);
        const confirmid = $(this).data('confirm').toString();
        alert(confirmid);
        $.ajax({
            url: '/friend/confirmrequest',
            method: 'GET',
            data: {id : confirmid},

            success:function(data){
                if(data.statusCode == 200){

                    clickedBtn.attr('hidden', true);
                    clickedBtn.closest('.add').find('.unfriend').attr('hidden', false).html('UnFriend');
                }
                if(data.statusCode == 500){
                    alert('something went wrong please try again');
                }
            }
        })
    })
})
</script>