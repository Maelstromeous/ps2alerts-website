// Declare variables to hold the placeholder content in memory for quick use later.
var territoryBarRender;

/**
 * Function to load placeholder content. Grabs from memory if already rendered, making for SUPER efficent rendering.
 *
 * @param  {[type]}   type       The type of placeholder to go through
 * @param  {[type]}   specificEl If we only require a placeholder render on a specific element, this will be popualted
 * @param  {Function} callback
 * @return void
 */
function loadPlaceholders(type, specificEl, callback) {
    if (type === 'territory-bar') {
        // If the placeholder variable is undefined or empty, generate it and populate it
        if (typeof(territoryBarRender) === 'undefined' || territoryBarRender.length === 0) {
            logDebug("Rendering territory bar placeholder");

            territoryBarRender = twig({
                id: "territoryBarRender",
                href: base_url + "/templates/common/placeholders/territory.bar.twig",
                async: false
            }).render();
        }

        if (specificEl !== null) {
            $(specificEl).html(territoryBarRender);
        } else {
            $('[data-placeholder="territory-bar"]').each(function(index, el) {
                $(el).html(territoryBarRender);
            });
        }

        if (typeof(callback) !== 'undefined') {
            callback();
        }
    }
}
