app.service('AnalyticsService', function($rootScope, $window, $location) {
    // Contains all elements that are currently registered
    var factory = {
        registry: []
    };

    // Registers GA Events by a class identifier
    // i.e. registerGAEventClass( $('.ga-event') );
    factory.registerGAEventClass = function(els) {
        // Passes each element to be processed
        $(els).each(function(index, el) {
            factory.registerGAEventSingle(el);
        });

        //console.log('registered', factory.registry);
    };

    // Registers a Google Analytics Event with the DOM then adds it to the registry
    factory.registerGAEventSingle = function(el) {
        var registered = $(el).attr('registered');

        // Prevent adding another registration, also checks if the element exists
        if (registered != 1) {
            //console.log('Registering single GA', el);
            var campaign = $(el).attr('ga-campaign');
            var action = $(el).attr('ga-action');
            var label = $(el).attr('ga-label');
            var value = $(el).attr('ga-value');
            var dynamicValue = $(el).attr('ga-dynamic-value');

            // Campaign and actions are required by GA
            if (campaign && action) {
                if (!label) {
                    label = '';
                }

                if (!value) {
                    value = '';
                }

                // If we have dynamic values, set up a click event that checks
                // the value of the element every time, otherwise statically
                if (dynamicValue == '1') {
                    console.log('Dynamic');
                    $(el).on('click', function() {
                        var value = $(this).attr('ga-value');
                        $window.ga('send', 'event', campaign, action, label, value);
                        console.log('ga-event sent:', campaign, action, label, value);
                    });
                } else {
                    $(el).on('click', function() {
                        var options = {
                            hitType: 'event',
                            eventCategory: campaign,
                            eventAction: action,
                            eventLabel: label,
                            eventValue: value
                        };
                        ga('send', options);
                        console.log('ga-event sent:', options);
                    });
                }

                // Register click event

                factory.registry.push(el); // Push element to registry
                $(el).attr('ga-registered', 1); // Prevent re-registration
            }
        }
    };

    var track = function() {
        $window.ga('send', 'pageview', { page: $location.url() });
    };
    $rootScope.$on('$viewContentLoaded', track);

    // Listener for the event. Supplied with a identifier (e.g. '.ga-event')
    $rootScope.$on('ga-sync', function(event, identifier) {
        //console.log('Root Scope received ga-sync:', identifier);
        factory.registerGAEventClass(identifier);
    });
});
