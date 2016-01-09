// Global function which takes a territory bar element and data, and then renders
// the bar with unform widths etc.
function renderTerritoryBar(data, elem, numbers, showOpposite) {
    var width = $(elem).outerWidth()

	if (data.draw === undefined) {
		data.draw = 0;
	}

    var totalSum = data.vs + data.nc + data.tr + data.draw;
    var totalPer = 0;

    // Standardize the width to a whole number to lessen the chance of decking
    $(elem).css('width', width.toFixed(0));

    console.log(data);

	// All good, show it!
	$(elem).find('.loading').fadeOut(function() {
        for (var i = 0; i < factions.length; i++) {
            var segment = $(elem).find('.' + factions[i] + '-segment');
            var metric  = $(segment).find('span');
            var per     = data[factions[i]] / totalSum * 100;
            var html    = '';
            var cutoff  = 5; // 5%

            // Calculate the final segment using the remaining space
            if (factions[i] === 'draw') {
                console.log( $(elem).id );
                console.log('totalPer',totalPer);
                var diff = 100 - totalPer;
                console.log('diff', diff);
                per = diff;
                console.log('floored per', per);
            }

            totalPer += per;

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

            // SET THE WIDTH!
            segment.css('width', per.toFixed(1)+'%');
            //

            metric.html(html);

            // Removes the text if the segment is too small to hold it
            if (per < cutoff) {
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
                var cutoff = $(this).attr('cutoff');
                if (cutoff === "1") {
                    $(this).html('');
                }
            }

            $(this).fadeIn();
        });
    });
}

$(document).ready(function() {
    loadPlaceholders('territory-bar');
    fireTooltips( $('.tooltipped') );
});

function fireTooltips(elem) {
    $(elem).tooltip();
}
