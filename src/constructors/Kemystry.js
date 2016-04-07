Kemystry = {
    open: function() {},
    setup: function() {
        for (var symbol in Lab.Workspace.Beakers) {
            Lab.Workspace.Beakers[symbol].prep();
        }
        var allTubes = Lab.Tools.Collector.Tubes.all();
        Lab.Tools.Styler.setup();
        allTubes.each(function(tube) {
            tube.getMixture().each(function(kemycal) {
                kemycal.act();
                if (kemycal.intensive.hasOwnProperty('react_on')) {
                    for (var event in kemycal.intensive.react_on) {
                        var eventName = kemycal.intensive.react_on[event];
                        (function(tube, kemycal, event) {
                            kemycal.tube.examine(event, function() {
                                kemycal.react(event);
                            });
                        })(kemycal.tube, kemycal, eventName); 
                    }
                }
            });
        });
    },
    beaker: function(kemycalProperties) {
        return Beaker(kemycalProperties);
    }
};