var storage = window.localStorage;
var updates = {
    1: {
        id: 1,
        title: 'New updates notification system!',
        timestamp: 1500840000,
        snippet: 'I\'ve created a new way to notify people of changes to the website! Traditionally this has just been shoved on the homepage and annoyed practically everyone, it\'s now neatly placed within a notification!',
        type: 'feature'
    },
    2: {
        id: 2,
        title: 'Date Filters are now available!',
        timestamp: 1503933904,
        snippet: 'You\'re now able to filter by dates on both the Homepage Statistics and the Alert History pages.',
        type: 'feature'
    }
};

// Set up the storage key for later use if not already defined
if (!storage.unseenIds) {
    storage.setItem('unseenIds', JSON.stringify([]));
}

function markAsSeen() {
    console.log('Marking as Seen');

    var unseenIds = JSON.parse(storage.unseenIds);
    _.forEach(updates, function(obj) {
        if (unseenIds.indexOf(obj.id) === -1) {
            unseenIds.push(obj.id);
        }
    });

    storage.setItem('unseenIds', JSON.stringify(unseenIds));

    console.log(unseenIds);
    console.log(storage.unseenIds);

    render();
}

function render() {
    var unseenCount = 0;
    var unseenIds = JSON.parse(storage.unseenIds);
    var deadline = parseInt(new Date().getTime() / 1000) - 2592000; // Now - 30 days in miliseconds

    _.forEach(updates, function(obj) {
        /* If update has not been seen and was less than 3 months ago (to prevent every
        update showing) */

        if (unseenIds.indexOf(obj.id) === -1 && obj.timestamp > deadline) {
            unseenCount++;
        }
    });

    var badge = $('#changelog-badge-count');
    if (unseenCount > 0) {
        badge.addClass('hasCount').html(unseenCount);
    } else {
        if (badge.hasClass('hasCount')) {
            badge.removeClass('hasCount').addClass('clearCount').html('');
        }
    }
}

$(window).on('viewLoaded', function() {
    render();

    $('#changelog-badge').click(function() {
        // Run again so the total is wiped and set correctly
        markAsSeen();
    });
});
