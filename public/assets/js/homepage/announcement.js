$("#announcement-view-more").click(function(event) {
    event.preventDefault();
    var expanded = $(this).attr('expanded');

    if (expanded == 0) {
        $(this).attr('expanded', 1)
        $("#announcement-more").slideDown();
        $("#announcement-view-more").html('Hide');
    } else {
        $(this).attr('expanded', 0)
        $("#announcement-more").slideUp();
        $("#announcement-view-more").html('Read More...');
    }
});
