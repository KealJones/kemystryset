Kemystry.beaker({
    // Simple Kemycal for Dynamic Utility Classes
    // Usage: 
    // uc:(what),(where),(amount) 
    // You can omit where to assume all - uc:(what),(amount) 
    // Add 20px of Padding to top - uc:p,t,20
    symbol: 'uc',
    extensive: {
        'preset': {
            's': '5',
            'm': '15',
            'l': '30'
        }
        'position': {
            't': 'top',
            'b': 'bottom',
            'l': 'left',
            'r': 'right',
            'a': '',
            'c': 'center'
        },
        'utility': {
            'p': 'padding',
            'm': 'margin',
            'w': 'width',
            'h': 'height',
            'ta': 'text-align',
            'fs': 'font-size'
        }
    },
    procedures: {
        act: function() {
            var state = this.state();
            var physicalObj = {};
            var property =
            var amount = '';
            if (state instanceof Array) {
                if (this.ext('utility').hasOwnProperty(state[0])) {
                    property += this.ext(state[0]);
                }
                if (state.hasOwnProperty(1)) {
                    amount = state[1];
                }
            } else {
                amount = state;
            }
            physicalObj[property] = amount;
            this.phys(physicalObj);
        },
        getState: function() {

        }
    }
});