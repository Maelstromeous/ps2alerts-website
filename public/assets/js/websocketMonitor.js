function flashWinner(faction, alertID) {

}

function setMonitorCountdown(alertID) {
    var elem = $("#monitor-" + alertID).find('.countdown');
    var time = elem.attr("todate");

    elem.countdown(time, function(event) {
        $(this).text(
            event.strftime('%H:%M:%S')
        );
    });
}
