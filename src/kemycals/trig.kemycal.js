KemystrySet.beaker({
        // Simple Kemycal for Quick Click Toggles
        symbol: 'trig',
        react_on: ['click'],
        extensive: {
            'close_content': '<a>CLOSE</a>',
            'action': {
                'show': {
                    0: {
                        'display': 'none'
                    },
                    1: {
                        'display': 'block'
                    }
                },
                'hide': {
                    0: {
                        'display': 'block'
                    },
                    1: {
                        'display': 'none'
                    }
                },
                'toggle': {
                    0: {
                        'user-select': 'none'
                    },
                    1: {
                        'user-select': 'none'
                    }
                }
            }
        },
        procedures: {
            prep: function(config) {
                extendConfig = function(destination, source) {
                    for (var property in source) {
                        if (source[property] && source[property].constructor && source[property].constructor === Object) {
                            destination[property] = destination[property] || {};
                            arguments.callee(destination[property], source[property]);
                        } else {
                            destination[property] = source[property];
                        }
                    }
                    return destination;
                };
                extendConfig(this.extensive(), config);
            },
            act: function() {
                var state = this.state();
                if (!(state instanceof Array)) {
                    return;
                }
                var key = state[0],
                    action = state[1],
                    active = state[2];
                if (active == null) {
                    this.state([key, action, 0]);
                    active = 0;
                }
                var actionProps = this.extensive('action');
                if (actionProps[action] != null && actionProps[action][active] != null) {
                    this.physical(actionProps[action][active]);
                }
                if (action == 'toggle') {
                    this.extensive('default_content', this.tube().content());
                }
                console.log(this.extensive('action'));
            },
            react: function(event) {
                var state = this.state();
                if (!(state instanceof Array)) {
                    return;
                }
                var key = state[0],
                    action = state[1],
                    active = state[2];
                if (action == 'toggle') {
                    if (active == 1) {
                        this.state([key, action, 0]);
                        active = 0;
                    } else {
                        this.state([key, action, 1]);
                        active = 1;
                    }
                    var actionProps = this.extensive('action');
                    if (actionProps[action] != null && actionProps[action][active] != null) {
                        this.physical(actionProps[action][active]);
                    }
                    this.others().each(function(kemycal) {
                        var state = kemycal.state();
                        var key = state[0],
                            action = state[1],
                            active = state[2];
                        if (key == this.state()[0]) {
                            var actionProps = kemycal.extensive('action');
                            kemycal.state([key, action, this.state()[2]]);
                            active = this.state()[2];
                            var actionProps = kemycal.extensive('action');
                            if (actionProps[action] != null && actionProps[action][active] != null) {
                                kemycal.physical(actionProps[action][active]);
                            }
                        }
                    }.bind(this));
                    if (active == 0) {
                        this.content(this.extensive('default_content'));
                    } else {
                        this.content(this.extensive('close_content'));
                    }
                }
            }
        }
    });