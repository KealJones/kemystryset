// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.
var Lab = {
    Workspace: {
        Beakers: {},
        Tubes: {},
        Physical: {}
    }
};
Lab.Tools = {
    Labeler: function() {
        var dateObject = new Date();
        var uniqueId = (Math.random() * dateObject.getTime()).toString(36).substring(9);
        return uniqueId;
    },
    Collector: {
        Tubes: {
            all: function() {
                Lab.Workspace.Tubes = new TubeRack(document.querySelectorAll('[' + KEMYSTRY_DATATAG_NAME + ']'));
                return Lab.Workspace.Tubes;
            },
            byKemycal: function(kemycalSymbol) {
                var allTubes = Lab.Tools.Collector.Tubes.all();
                var tubesByKemycal = [];
                for (var tube in allTubes.Rack) {
                    if (allTubes.Rack.hasOwnProperty(tube)) {
                        var mixture = allTubes.Rack[tube].getMixture();
                        if (mixture.Kemycals.hasOwnProperty(kemycalSymbol)) {
                            tubesByKemycal.push(allTubes.Rack[tube]);
                        }
                    }
                }
                return new TubeRack(tubesByKemycal);
            }
        },
        Kemycals: {
            all: function() {
                var allTubes = Lab.Tools.Collector.Tubes.all();
                var allKemycals = [];
                for (var tube in allTubes.Rack) {
                    if (allTubes.Rack.hasOwnProperty(tube)) {
                        var mixture = allTubes.Rack[tube].getMixture();
                        mixture.each(function(kemycal) {
                            allKemycals.push(kemycal);
                        }.bind(allKemycals));
                    }
                }
                return new KemycalMixture(allKemycals);
            },
            bySymbol: function(kemycalSymbol) {
                var testTubesByKemycal = Lab.Tools.Collector.Tubes.byKemycal(kemycalSymbol);
                var kemycalsBySymbol = [];
                for (var tube in testTubesByKemycal.Rack) {
                    if (testTubesByKemycal.Rack.hasOwnProperty(tube)) {
                        var mixture = testTubesByKemycal.Rack[tube].getMixture();
                        if (mixture.Kemycals.hasOwnProperty(kemycalSymbol)) {
                            kemycalsBySymbol.push(mixture.Kemycals[kemycalSymbol]);
                        }
                    }
                }
                return new KemycalMixture(kemycalsBySymbol);
            }
        }
    },
    Styler: {
        setup: function() {
            var kemystryStyleTag = document.getElementById('kemystry-kemycals-physical-props');
            if (kemystryStyleTag === null) {
                head = document.head || document.getElementsByTagName('head')[0] || document.body || document.getElementsByTagName('body')[0];
                kemystryStyleTag = document.createElement('style');
                kemystryStyleTag.id = 'kemystry-kemycals-physical-props';
                kemystryStyleTag.type = 'text/css';
                head.appendChild(kemystryStyleTag);
            }
            Lab.Tools.Styler.update();
        },
        add: function(symbol, state, style) {
            if (!Lab.Workspace.Physical[symbol]) {
                Lab.Workspace.Physical[symbol] = {};
            }
            Lab.Workspace.Physical[symbol][state] = style;
        },
        update: function() {
            var kemystryStyleTag = document.getElementById('kemystry-kemycals-physical-props');
            if (kemystryStyleTag !== null) {
                kemystryStyleTag.innerHTML = Lab.Tools.Styler.get();
            } else {
                Lab.Tools.Styler.setup();
            }
        },
        get: function() {
            return Lab.Tools.Styler.make.css();
        },
        make: {
            attr: function(name, value) {
                if (value == 'base') {}
                return name + ': ' + value + ';\n';
            },
            attrs: function(object) {
                cssAttrString = '';
                for (var cssProp in object) {
                    if (object.hasOwnProperty(cssProp)) {
                        cssAttrString += "\t" + Lab.Tools.Styler.make.attr(cssProp, object[cssProp]); //attr + ': ' + object[attr] + ';\n';
                    }
                }
                return cssAttrString;
            },
            css: function() {
                var css = '';
                for (var kemycalSymbol in Lab.Workspace.Physical) {
                    if (Lab.Workspace.Physical.hasOwnProperty(kemycalSymbol)) {
                        for (var kemycalState in Lab.Workspace.Physical[kemycalSymbol]) {
                            if (kemycalState == 'base') {
                                css += '[data-kemy*=\"' + kemycalSymbol + ':\"] {\n' + Lab.Tools.Styler.make.attrs(Lab.Workspace.Physical[kemycalSymbol][kemycalState]) + "}\n";
                            } else {
                                css += '[data-kemy*="' + kemycalSymbol + ':' + kemycalState + '"] {\n' + Lab.Tools.Styler.make.attrs(Lab.Workspace.Physical[kemycalSymbol][kemycalState]) + "}\n";
                            }
                        }
                    }
                }
                return css;
            }
        }
    },
    Deriver: {
        derive: function(kemycalFormula) {
            return this.deriveFormula(kemycalFormula);
        },
        deriveFormula: function(formula) {
            var derivedFormula = [],
                definitionCollection,
                derivedKemycal;
            var kemycalCollection = formula.split(KEMYCAL_SEPARATOR);
            var size = kemycalCollection.length,
                i = 0;
            for (i; i < size; i++) {
                derivedKemycal = this.deriveKemycal(kemycalCollection[i]);
                derivedFormula[derivedKemycal.symbol] = derivedKemycal.state;
                // Try to solve multiple of same kemycal in one formula
                //derivedFormula.push([derivedKemycal.symbol,derivedKemycal.state]);
            }
            return derivedFormula;
        },
        deriveKemycal: function(kemycal) {
            var derivedKemycal = {},
                kemycalBody,
                kemycalSymbol,
                kemycalState;
            kemycalBody = kemycal.split(KEMYCAL_KEY_VALUE_SEPARATOR);
            kemycalSymbol = kemycalBody[0].trim().toLowerCase();
            kemycalState = this.deriveState(kemycalBody[1].trim());
            derivedKemycal.symbol = kemycalSymbol;
            derivedKemycal.state = kemycalState;
            return derivedKemycal;
        },
        deriveState: function(state) {
            var derivedState = state.split(',');
            if (derivedState instanceof Array) {
                if (derivedState.length == 1) {
                    derivedState = derivedState[0];
                }
            }
            return derivedState;
        },
        underive: function(kemycalDerivedFormula) {
            return this.underiveFormula(kemycalDerivedFormula);
        },
        underiveFormula: function(kemycalDerivedFormula) {
            var underivedFormula,
                underivedKemycal;
            underivedKemycal = this.underiveKemycal(kemycalDerivedFormula);
            underivedFormula = underivedKemycal.join(' ');
            return underivedFormula;
        },
        underiveKemycal: function(kemycalDerivedKemycal) {
            var underivedKemycal = [];
            for (var kemycal in kemycalDerivedKemycal) {
                if (!kemycalDerivedKemycal.hasOwnProperty(kemycal)) continue;
                underivedKemycal.push(kemycal + KEMYCAL_KEY_VALUE_SEPARATOR + this.underiveState(kemycalDerivedKemycal[kemycal].state()));
            }
            return underivedKemycal;
        },
        underiveState: function(kemycalDerivedState) {
            if (kemycalDerivedState instanceof Array) {
                underivedState = kemycalDerivedState.join(',');
            } else {
                underivedState = kemycalDerivedState;
            }
            return underivedState;
        }
    },
    Holder: function() {
        var args = arguments[0];
        return {
            contains: function(search) {
                var checkThis = args[0];
                switch (typeof checkThis) {
                    case 'object':
                        if (Object.prototype.toString.call(checkThis) == '[object Array]') {
                            var i = checkThis.length;
                            while (i--) {
                                if (checkThis[i] === search) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        if (checkThis instanceof Tube) {
                            if (typeof search == 'string') {
                                return (checkThis.mixture.Kemycals.hasOwnProperty(search) ? true : false);
                            } else {
                                if (search.hasOwnProperty('intensive')) {
                                    return (checkThis.mixture.Kemycals.hasOwnProperty(search.intensive.symbol) ? true : false);
                                }
                            }
                        }
                        return (checkThis.hasOwnProperty(search) ? true : false);
                    case 'string':
                        return checkThis.indexOf(search) !== -1;
                }
            },
            getByDot: function(desc, value) {
                var obj = args;
                var arr = desc ? desc.split(".") : [];
                while (arr.length && obj) {
                    var comp = arr.shift();
                    var match = new RegExp("(.+)\\[([0-9]*)\\]").exec(comp);
                    // handle arrays
                    if ((match !== null) && (match.length == 3)) {
                        var arrayData = {
                            arrName: match[1],
                            arrIndex: match[2]
                        };
                        if (obj[arrayData.arrName] !== undefined) {
                            if (typeof value !== 'undefined' && arr.length === 0) {
                                obj[arrayData.arrName][arrayData.arrIndex] = value;
                            }
                            obj = obj[arrayData.arrName][arrayData.arrIndex];
                        } else {
                            obj = undefined;
                        }
                        continue;
                    }
                    // handle regular things
                    if (typeof value !== 'undefined') {
                        if (obj[comp] === undefined) {
                            obj[comp] = {};
                        }
                        if (arr.length === 0) {
                            obj[comp] = value;
                        }
                    }
                    obj = obj[comp];
                }
                return obj;
            }
        };
    }
};