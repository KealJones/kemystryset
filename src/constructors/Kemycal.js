/**
 * Kemycals are like plugins. They have special properties and abilities to do a variety of things.
 */
function Kemycal(kemycalProperties) {
    this._labId = Lab.Tools.Labeler();
    this.intensive = {
        symbol: ''
    };
    this.extensive = {};
    this.procedures = {};
    if (kemycalProperties.hasOwnProperty('intensive')) {
        this.intensive = kemycalProperties.intensive;
    }
    if (kemycalProperties.hasOwnProperty('react_on')) {
        this.intensive.react_on = kemycalProperties.react_on;
    }
    if (kemycalProperties.hasOwnProperty('extensive')) {
        this.extensive = kemycalProperties.extensive;
    }
    if (kemycalProperties.hasOwnProperty('procedures')) {
        this.procedures = kemycalProperties.procedures;
    }
    if (kemycalProperties.hasOwnProperty('symbol')) {
        this.intensive.symbol = kemycalProperties.symbol.toLowerCase();
    }
    return this;
}
Kemycal.prototype = {
    prep: function(userExtensive) {
        mergeExtensive = function(destination, source) {
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
        if (!(this.intensive.hasOwnProperty('user_extensive') && this.intensive.user_extensive === false)) {
            mergeExtensive(this.extensive, userExtensive);
        }
        if (this.hasOwnProperty('procedures') && this.procedures.hasOwnProperty('prep')) {
            this.procedures.prep.apply(this, arguments);
        }
        return this;
    },
    act: function() {
        if (this.hasOwnProperty('procedures') && this.procedures.hasOwnProperty('act')) {
            this.procedures.act.apply(this, arguments);
        }
        return this;
    },
    react: function() {
        if (this.hasOwnProperty('procedures') && this.procedures.hasOwnProperty('react')) {
            this.procedures.react.apply(this, arguments);
        }
        return this;
    },
    symbol: function() {
        return this.intensive.symbol;
    },
    state: function(kemycalState) {
        if (kemycalState) {
            this.intensive.state = kemycalState;
            if (this.hasOwnProperty('tube')) {
                this.tube.updateFormula();
            }
            return this;
        }
        return this.intensive.state;
    },
    ext: function(propKey, propValue) {
        if (propKey) {
            if (typeof propKey == 'object') {
                for (var propertyName in propKey) {
                    this.ext(propertyName, propKey[propertyName]);
                }
                return this.extensive;
            } else {
                if (propValue) {
                    return Lab.Tools.Holder(this.extensive).getByDot(propKey, propValue);
                }
                return Lab.Tools.Holder(this.extensive).getByDot(propKey);
            }
        }
        return this.extensive;
    },
    phys: function(style, state) {
        if (state === undefined) {
            state = Lab.Tools.Deriver.underiveState(this.state());
        }
        if (state instanceof Array) {
            state = Lab.Tools.Deriver.underiveState(state);
        }
        Lab.Tools.Styler.add(this.symbol(), state, style);
        Lab.Tools.Styler.update();
        return this;
    },
    content: function(content) {
        this.tube.content(content);
        return this;
    },
    tube: function() {
        return this.tube;
    },
    getAll: function() {
        Lab.Tools.Collector.Tubes.all();
        var all = Lab.Tools.Collector.Kemycals.bySymbol(this.symbol());
        return all;
    },
    getOthers: function() {
        var others = Lab.Tools.Collector.Kemycals.bySymbol(this.symbol());
        for (var kemycal in others.Kemycals) {
            if (others.Kemycals[kemycal]._labId == this._labId) {
                others.Kemycals.splice(kemycal, 1);
            }
        }
        return others;
    },
    sell: function() {
        if (typeof $ != 'undefined') {
            return this.tube().sell();
        }
        return 'Sorry, You Need Money.';
    },
    proc: function(procedureId) {
        if (this.hasOwnProperty('procedures') && this.procedures.hasOwnProperty(procedureId)) {
            return this.procedures[procedureId].apply(this, arguments);
        }
    }
};