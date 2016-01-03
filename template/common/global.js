var api_url = '{{ api_url }}';

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
function renderTerritoryBar(data, elem) {
    var width = $(elem).outerWidth();
	if (data.draw === undefined) {
		data.draw = 0;
	}

	var vsBar   = $(elem).find('.vs-segment');
	var ncBar   = $(elem).find('.nc-segment');
	var trBar   = $(elem).find('.tr-segment');
	var drawBar = $(elem).find('.draw-segment');

    var vsPx   = Math.round(width / 100 * data.vs);
    var ncPx   = Math.round(width / 100 * data.nc);
    var trPx   = Math.round(width / 100 * data.tr);
    var drawPx = Math.round(width / 100 * data.draw);

	// All good, show it!
	$(elem).find('.loading').fadeOut(function() {
		vsBar.css('width', vsPx).html(data.vs.toFixed(1) + '%').fadeIn();
		ncBar.css('width', ncPx).html(data.nc.toFixed(1) + '%').fadeIn();
		trBar.css('width', trPx - 1).html(data.tr.toFixed(1) + '%').fadeIn(); // -1 to ensure we don't break container due to rounding
		drawBar.css('width', drawPx).html(data.draw.toFixed(1) + '%').fadeIn();
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
