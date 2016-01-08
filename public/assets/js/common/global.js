var vsColor   = '#61088F';
var ncColor   = '#2732A8';
var trColor   = '#A90000';
var drawColor = '#4B4B4B';

var servers  = [1,10,13,17,25,1000,2000];
var zones    = [2,4,6,8];
var factions = ['vs','nc','tr','draw'];

var debug = 1;

var serverNames = {
    1: 'Connery',
    10: 'Miller',
    13: 'Cobalt',
    17: 'Emerald',
    19: 'Jaeger',
    25: 'Briggs',
    1000: 'Genudine',
    2000: 'Ceres'
};

// Global function which takes a territory bar element and data, and then renders
// the bar with unform widths etc.
function renderTerritoryBar(data, elem, numbers, showOpposite) {
    var width = $(elem).outerWidth();

	if (data.draw === undefined) {
		data.draw = 0;
	}

    var totalSum = data.vs + data.nc + data.tr + data.draw;
    var totalPx = 0;

    // Standardize the width to a whole number to lessen the chance of decking
    $(elem).css('width', width.toFixed(0));

	// All good, show it!
	$(elem).find('.loading').fadeOut(function() {
        for (var i = 0; i < factions.length; i++) {
            var segment = $(elem).find('.' + factions[i] + '-segment');
            var metric  = $(segment).find('span');
            var per     = data[factions[i]] / totalSum * 100;
            var px      = Math.round(width / 100 * per);
            var html    = '';
            var cutoff  = 45;

            // Calculate the final segment using the remaining space
            if (factions[i] === 'draw') {
                px = (width - totalPx);
            }

            totalPx += px;

            // If we have a width breakage
            if (totalPx > width) {
                px =  (totalPx - width);
            }

            // Add data attributes should we ever want to do "flipovers"
            $(metric).attr({
                "data-percent" : per.toFixed(1),
                "data-number"  : data[factions[i]]
            });

            if (numbers === true) {
                html = data[factions[i]];
            } else {
                html = per.toFixed(1) + '%';
            }

            // Adds the class metric-flipover. See function flipoverSegments.
            if (showOpposite === true) {
                var flipto = 'numbers';

                if (numbers === true) {
                    flipto = 'percent';
                }

                $(metric).attr('flipto', flipto).addClass('metric-flipover');
            }

            segment.css('width', px);
            metric.html(html);

            // Removes the text if the segment is too small to hold it
            if (px < cutoff) {
                metric.html('');
                metric.attr('cutoff', 1);

                // Add a tooltip to the segment so people can hover over and
                // still get the information
                segment.attr({
                    "data-position": "top",
                    "data-delay"   : "0",
                    "data-tooltip" : factions[i] + ': '+ data[factions[i]] + ' (' + per.toFixed(1) + '%)'
                }).addClass('tooltipped');

                fireTooltips(segment);
            }
        }

        var fadeInTimeout = 0;

        $(elem).find('.segment').each(function(index, el) {
            $(el).delay(fadeInTimeout).fadeIn();
            fadeInTimeout += 100;
        });
	});
}

// Console.log optional logging messages
function logDebug(message) {
    if (debug === 1) {
        console.log(message);
    }
}

/*$("#credits").popover({
	content: "<p><b>Anioth:</b> Spending many, many hours with me helping me debug the WebSocket stuff, creating the new Alert Maps as well as helping me get to grips with SlickGrid. He's also a JavaScript wizard.</p><p><b>Jhett12321:</b> For developing the WebSocket framework that this site utilises, and for introducing me into the world of WebSockets. Plus he's Australian, therefore he's cool.</p><p><b>Planetside Battles Team:</b> For having the opportunity to develop the statistics system for them, and baring with me when things broke (which it did, many times). Also to various staff members for helping me test.</p><p><b>sArs:</b> For making the new header images on this website. They look damn cool! :-)</p>",
	placement: 'top',
	html: true,
	title: "Creditations"
});
*/

setInterval(function() {
    flipoverMetrics();
}, 5000);

// Grabs all metrics elements and flips them over, showing percentage / numerical
// values
function flipoverMetrics() {
    $('.metric-flipover').each(function(index, el) {
        var flipto = $(this).attr('flipto');
        var metric;
        var segment = $(this).hasClass('segment-metric');

        if (flipto === 'numbers') {
            $(this).attr('flipto', 'percent');
            metric = $(this).attr('data-number');
        } else {
            $(this).attr('flipto', 'numbers');
            metric = $(this).attr('data-percent') + '%';
        }

        $(this).fadeOut(function() {
            $(this).html(metric);

            // If part of a territory bar segment, calculate whether or not
            // to show the html part based on size.
            if (segment === true) {
                var width = $(this).parent('div').outerWidth();
                var cutoff = 45;

                if (width < cutoff) {
                    $(this).html('');
                }
            }

            $(this).fadeIn();
        });
    });
}

$(document).ready(function(){
    fireTooltips( $('.tooltipped') );
});

function fireTooltips(elem) {
    $(elem).tooltip();
}
