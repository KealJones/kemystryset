KemystrySet.beaker({
    // Simple Kemycal for Dynamic Utility Classes
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
                if (this.extensive().hasOwnProperty(state[0])) {
                    property += this.extensive(state[0]);
                }
                if (state.hasOwnProperty(1)) {
                    amount = state[1];
                }
            } else {
                amount = state;
            }
            physicalObj[property] = amount;
            this.physical(physicalObj);
        }
    }
});