var timelineEvents = {
    type: 'flags',
    name: 'Flags on axis',
    data: [{
        x: 1418947200000,
        title: 'SOE broke alerts',
        text: "SOE released a patch which unfortunately broke alerts. They weren't able to fix it until after the xmas holidays."
    }, {
        x: 1423785600000,
        title: 'Coding issue',
        text: 'I broke it. Badly.'
    }, {
        x: 1427414400000,
        title: 'API Fail',
        text: 'Middleman API disruption'
    }, {
        x: 1430784000000,
        title: 'Coding Issue',
        text: 'New integrations with middleman API'
    }, {
        x: 1432166400000,
        title: 'Census Dist',
        text: 'Census API disruption'
    }, {
        x: 1433808000000,
        title: 'API Fail',
        text: 'Middleman API disruption'
    }, {
        x: 1434585600000,
        title: '2x Alerts',
        text: 'DBG released an unintentional change where all alerts fired approx 2/3x more than normal.'
    }, {
        x: 1435449600000,
        title: 'Coding Issue',
        text: 'Various code stability issues.'
    }, {
        x: 1435795200000,
        title: 'PS4',
        text: 'Integration with PS4 Servers. Things broke.'
    }, {
        x: 1436486400000,
        title: 'API Fail',
        text: 'Middleman API disruption'
    }, {
        x: 1437350400000,
        title: 'Daybreak DDOSed',
        text: 'Daybreak was undergoing DDOS by LizardSquad. Lasted for two days'
    }, {
        x: 1441411200000,
        title: 'Territory Cutoff Update',
        text: 'Due to changes made in the game that DBG did not support via the API, territory %s were off.'
    }, {
        x: 1449532800000,
        title: "PS2Alerts' webserver hacked",
        text: "PS2Alert's webserver got hacked, therefore all services were taken offline until proper measures were put in place. This blackout lasted for about a week."
    }, {
        x: 1450828800000,
        title: 'Code instability',
        text: "The collection script crashed. I was having quality time with my family over christmas, don't judge me."
    }],
    shape: 'squarepin',
    style: {
        color: '#FFF'
    },
    y: 22,
    fillColor: '#395C84',
    states: {
        hover: {
            fillColor: '#395C84'
        }
    }
};
