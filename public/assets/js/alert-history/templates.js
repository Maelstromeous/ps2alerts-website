// Builds all of the twig partials, ready for reference by the population script

var twigAlertTable = twig({
    id: "twigAlertTable",
    href: base_url + "/templates/alert-history/alert.row.twig",
    // for this example we'll block until the template is loaded
    async: true
});
