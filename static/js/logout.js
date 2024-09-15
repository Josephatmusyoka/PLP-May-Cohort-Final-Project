$(document).ready(function() {
    $('#logoutBtn').click(function() {
        $.ajax({
            type: 'GET',
            url: '/logout',
            success: function(response) {
                window.location.href = '/';
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
});
