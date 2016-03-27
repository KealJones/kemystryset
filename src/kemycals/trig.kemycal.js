Kemystry.beaker({
    // Simple Kemycal for Quick Click Toggles
    symbol: 'trig',
    react_on: ['click'],
    extensive: {
        close_content: 'CLOSE',
        action: {
            show: {
                off: {
                    'display': 'none'
                },
                on: {
                    'display': 'block'
                }
            },
            hide: {
                off: {
                    'display': 'block'
                },
                on: {
                    'display': 'none'
                }
            },
            toggle: {
                off: {
                    'cursor': 'pointer',
                    '-webkit-touch-callout': 'none',
                    '-webkit-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-moz-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                },
                on: {
                    'cursor': 'pointer',
                    '-webkit-touch-callout': 'none',
                    '-webkit-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-moz-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                }
            }
        }
    },
    procedures: {
        prep: function() {
            var actionProps = this.extensive('action');
            var allTrigKemycals = this.getAll();
            var keyActions = {};
            allTrigKemycals.each(function(kemycal) {
                var parsedState = kemycal.procedure('getState');
                if (parsedState == null) {
                    return;
                }
                if (!(keyActions[parsedState.key] instanceof Object)) {
                    keyActions[parsedState.key] = {};
                }
                keyActions[parsedState.key][parsedState.action] = [];
            });
            for (var key in keyActions) {
                var actions = Object.keys(keyActions[key]);
                for (var action in actions) {
                    action = actions[action];
                    if (actionProps.hasOwnProperty(action) && actionProps[action].hasOwnProperty('on')) {
                        this.physical(actionProps[action].on, [key, action, 1]);
                    }
                    if (actionProps.hasOwnProperty(action) && actionProps[action].hasOwnProperty('off')) {
                        this.physical(actionProps[action].off, [key, action, 0]);
                    }
                }
            }
        },
        act: function() {
            var parsedState = this.procedure('getState');
            if (parsedState.action == 'toggle') {
                this.extensive('default_content', this.tube().content());
            }
        },
        react: function(event) {
            var parsedState = this.procedure('getState');
            if (parsedState == null) {
                return;
            }
            if (parsedState.action == 'toggle') {
                this.procedure('switchStatus');
                this.getOthers().each(function(kemycal) {
                    var kemycalstate = kemycal.procedure('getState');
                    if (kemycalstate == null) {
                        return;
                    }
                    if (parsedState.key == kemycalstate.key) {
                        kemycalstate = kemycal.procedure('switchStatus');
                    }
                });
                if (parsedState.statusCode == 1) {
                    this.content(this.extensive('default_content'));
                } else {
                    this.content(this.extensive('close_content'));
                }
            }
        },
        getState: function() {
            var rawstate = this.state();
            if (!(rawstate instanceof Array)) {
                return null;
            }
            var parsedState = {
                key: null,
                action: null,
                statusCode: 0,
                status: 'off'
            };
            if (typeof rawstate[0] != 'undefined') {
                parsedState.key = rawstate[0];
            }
            if (typeof rawstate[1] != 'undefined') {
                parsedState.action = rawstate[1];
            }
            if (typeof rawstate[2] != 'undefined') {
                if (rawstate[2] == 0 || rawstate[2] == "0") {
                    parsedState.statusCode = 0;
                    parsedState.status = 'off';
                }
                if (rawstate[2] == 1 || rawstate[2] == "1") {
                    parsedState.status = 'on';
                    parsedState.statusCode = 1;
                }
            }
            this.state([parsedState.key, parsedState.action, parsedState.statusCode]);
            return parsedState;
        },
        switchStatus: function() {
            var parsedState = this.procedure('getState');
            if (parsedState.statusCode == 0 || parsedState.statusCode == "0") {
                parsedState.statusCode = 1;
                parsedState.status = 'on';
            } else {
                parsedState.status = 'off';
                parsedState.statusCode = 0;
            }

            this.state([parsedState.key, parsedState.action, parsedState.statusCode]);
            return this.procedure('getState');
        },
    },
});