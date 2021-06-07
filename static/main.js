$('.like-btn').on('click', function(event) {
    event.preventDefault();
    const id = $(this).attr('data-id');
    $.ajax({
        url: '/add/' + id,
        method: 'POST',
        data: { id: id }
        }).done(function(res) {
            if (res.success) {
            console.log('id from ajax call is', res);
            window.location.reload();
        } else {
            console.log('error...ajax');
        }
    });
}); 

$('.unlike-btn').on('click', function(event) {
    event.preventDefault();
    const id = $(this).attr('data-id');
    $.ajax({
        url: '/delete/' + id,
        method: 'DELETE',
        data: { id: id }
        }).done(function(res) {
            if (res.success) {
            window.location.reload();
        } else {
            console.log('error...ajax');
        }
    });
}); 