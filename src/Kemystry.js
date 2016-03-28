(function(root, factory) {
    "use strict";
    if (typeof module == "object" && typeof module.exports == "object") {
        module.exports = root.document ? factory(root, true) : function(w) {
            if (!w.document) {
                throw new Error("Kemystry-WD");
            }
            return factory(w);
        };
    } else {
        factory(root);
    }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    /**
     * Kemystry.js is a library to help make simple reuseable modules by writing short "formulas"
     * @class Kemystry
     * @constructor init
     * @author Keal Jones at We Are Kemy
     */
    var Kemystry = (function(Kemystry) {
        //Shorthands
        var KEMYSTRY_DATATAG_NAME = 'data-kemy',
            KEMYCAL_SEPARATOR = ' ',
            KEMYCAL_KEY_VALUE_SEPARATOR = ':',
            KEMYCAL_MULTIPLE_VALUES_SEPARATOR = ',',
            KEMYCAL_PROPERTY_TAG_NAME = 'symbol',
            KEMYCAL_PROPERTY_METHODS_NAME = 'procedures',
            REQUIRED_KEMYCAL_PROPERTIES = ['name'];
        Kemystry = {
            open: function() {
            },
            setup: function() {
                for (var symbol in Lab.Workspace.Beakers) {
                    Lab.Workspace.Beakers[symbol].prep();
                }
                var allTubes = Lab.Util.Gather.Tubes.all();
                Lab.Util.PhysicalCSS.setup();
                allTubes.each(function(tube) {
                    tube.getMixture().each(function(kemycal) {
                        kemycal.act();
                        if (kemycal.intensive.hasOwnProperty('react_on')) {
                            for (var event in kemycal.intensive.react_on) {
                                var eventName = kemycal.intensive.react_on[event];

                                (function(tube, kemycal, event) {
                                    kemycal.tube.examine(event, function() {
                                        kemycal.react(event)
                                    })
                                })(kemycal.tube, kemycal, eventName)
                            }
                        }
                    });
                });
            },
            beaker: function(kemycalProperties) {
                return Beaker(kemycalProperties);
            }
        };

        function Beaker(kemycalProperties) {
            if (typeof kemycalProperties == 'object') {
                var beaker = Lab.Workspace.Beakers[kemycalProperties.symbol.toLowerCase()] = new Kemycal(kemycalProperties);
                return this;
            } else {
                if (kemycalProperties && Lab.Workspace.Beakers.hasOwnProperty(kemycalProperties.toLowerCase())) {
                    return {
                        prep: function(extProps) {
                            Lab.Workspace.Beakers[kemycalProperties.toLowerCase()].prep(extProps);
                            return this;
                        }
                    };
                }
            }
        }
        /**
         * Tube is a DOM element that has the DATATAG attribute.
         */
        function Tube(el) {
            this.element = el;
            this.mixture = new KemycalMixture(this.element.getAttribute(KEMYSTRY_DATATAG_NAME));
            for (var kemycal in this.mixture.Kemycals) {
                var kemycalInst = this.mixture.Kemycals[kemycal];
                kemycalInst.tube = this;
            }
        }
        Tube.prototype = {
            getMixture: function() {
                return this.mixture;
            },
            updateFormula: function() {
                this.element.setAttribute(KEMYSTRY_DATATAG_NAME, Lab.Util.Deriver.underive(this.mixture.Kemycals));
                return this;
            },
            content: function(contentValue) {
                if (contentValue) {
                    this.element.innerHTML = contentValue;
                    return this;
                }
                return this.element.innerHTML;
            },
            sell: function() {
                if (typeof $ != 'undefined') {
                    return $(this.element);
                }
                if (typeof jQuery != 'undefined') {
                    return jQuery(this.element);
                }
                if (typeof window.jQuery != 'undefined') {
                    return window.jQuery(this.element);
                }
                return null; // Sorry, no one is buying
            },
            examine: function(event, callback) {
                if (document.addEventListener) {
                    this.element.addEventListener(event, callback, false);
                } else if (document.attachEvent) {
                    this.element.attachEvent("on" + event, callback);
                } else {
                    this.element["on" + event] = callback;
                }
            },
            unexamine: function(event, callback) {
                if (document.removeEventListener) {
                    this.element.removeEventListener(event, callback, false);
                } else if (document.detachEvent) {
                    this.element.detachEvent("on" + event, callback);
                } else {
                    this.element["on" + event] = null;
                }
            },
        };
        /**
         * Kemycals are like plugins. They have special properties and abilities to do a variety of things.
         */
        function Kemycal(kemycalProperties) {
            this._labId = Lab.Util.Label();
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
                if (!(this.intensive.hasOwnProperty('user_extensive') && this.intensive.user_extensive == false)) {
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
                            return Lab.Util._(this.extensive).getByDot(propKey,propValue);
                        }
                        return Lab.Util._(this.extensive).getByDot(propKey);
                    }
                }
                return this.extensive;
            },
            phys: function(style, state) {
                if (state == undefined) {
                    state = Lab.Util.Deriver.underiveState(this.state());
                }
                if (state instanceof Array) {
                    state = Lab.Util.Deriver.underiveState(state);
                }
                Lab.Util.PhysicalCSS.add(this.symbol(), state, style);
                Lab.Util.PhysicalCSS.update();
                return this;
            },
            content: function(content) {
                this.tube.content(content);
                return this;
            },
            tube: function() {
                return this.tube;
            },
            getTubes: function() {
                if (Lab.Workspace.Tubes.size() == 0) {
                    Lab.Workspace.Tubes = Lab.Util.Gather.Tubes.all();
                }
                var all = Lab.Util.Gather.Tubes.byKemycal(this.symbol());
                return all;
            },
            getAll: function() {
                Lab.Util.Gather.Tubes.all();
                var all = Lab.Util.Gather.Kemycals.bySymbol(this.symbol());
                return all;
            },
            getOthers: function() {
                var others = Lab.Util.Gather.Kemycals.bySymbol(this.symbol());
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
            },
        };
        /**
         * KemycalMixture is an array of Kemycal Instances
         */
        function KemycalMixture(kemycalFormula) {
            if (kemycalFormula instanceof Array) {
                var mixedKemycals = [];
                for (var kemycal in kemycalFormula) {
                    mixedKemycals.push(kemycalFormula[kemycal]);
                }
            } else {
                var mixedKemycals = {};
                var derivedFormula = Lab.Util.Deriver.derive(kemycalFormula);
                for (var kemycalSymbol in derivedFormula) {
                    var pipette = Pipette(kemycalSymbol);
                    if (pipette != false) {
                        mixedKemycals[kemycalSymbol] = pipette;
                        mixedKemycals[kemycalSymbol].state(derivedFormula[kemycalSymbol]);
                    }
                }
            }
            this.Kemycals = mixedKemycals;
            return this;
        }
        KemycalMixture.prototype = {
            each: function(proc) {
                for (var kemycal in this.Kemycals) {
                    proc(this.Kemycals[kemycal]);
                }
            },
            get: function(offset) {
                return this.Kemycals[offset];
            },
            size: function() {
                return Object.keys(this.Kemycals).length;
            }
        };
        /**
         * Pipette makes a new Kemycal Instance from the base properties defined by the Beaker.
         */
        function Pipette(kemycalSymbol) {
            function takeProperties(obj) {
                var copy;
                // Handle the 2 simple types, and null or undefined
                if (null == obj || "object" != typeof obj) return obj;
                // Handle Array
                if (obj instanceof Array) {
                    copy = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        copy[i] = takeProperties(obj[i]);
                    }
                    return copy;
                }
                // Handle Object
                if (obj instanceof Object) {
                    copy = {};
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr)) copy[attr] = takeProperties(obj[attr]);
                    }
                    return copy;
                }
                throw new Error("Unable to copy obj! Its type isn't supported.");
            }
            if (Lab.Workspace.Beakers.hasOwnProperty(kemycalSymbol)) {
                var kemycalSource = Lab.Workspace.Beakers[kemycalSymbol];
                if (null == kemycalSource || "object" != typeof kemycalSource) return;
                // using takeProperties prevents copy by referance
                var kemycalSourceProperties = takeProperties(kemycalSource);
                var kemycalDrop = new Kemycal(kemycalSourceProperties);
                return kemycalDrop;
            }
            return false;
        }
        /**
         * TubeRack is an array of Tube Instances
         */
        function TubeRack(els) {
            var TubeElements = [];
            for (var i = 0, el; el = els[i]; i++) {
                if (el instanceof Tube) {
                    TubeElements.push(el);
                } else {
                    TubeElements.push(new Tube(el));
                }
            }
            this.Rack = TubeElements;
        }
        TubeRack.prototype = {
            each: function(proc) {
                for (var i = 0, tube; tube = this.Rack[i]; i++) {
                    proc(tube);
                }
            },
            get: function(offset) {
                return this.Rack[offset];
            },
            byKemycal: function(symbol) {
                var tubesByKemycal = [];
                for (var tube in this.Rack) {
                    var mixture = this.Rack[tube].getMixture();
                    if (mixture.Kemycals.hasOwnProperty(kemycalSymbol)) {
                        tubesByKemycal.push(this.Rack[tube]);
                    }
                }
                return new TubeRack(tubesByKemycal);
            },
            size: function() {
                return Object.keys(this.Rack).length;
            }
        };
        /********************************************************
         * Private Methods and Vars
         ********************************************************/
        var Lab = {
            Workspace: {
                Beakers: {},
                Kemycals: {},
                Tubes: {},
                Physical: {},
            }
        };
        Lab.Util = {
            Label: function() {
                var dateObject = new Date();
                var uniqueId = (Math.random() * dateObject.getTime()).toString(36).substring(9);
                return uniqueId;
            },
            Gather: {
                Tubes: {
                    all: function() {
                        Lab.Workspace.Tubes = new TubeRack(document.querySelectorAll('[' + KEMYSTRY_DATATAG_NAME + ']'));
                        return Lab.Workspace.Tubes;
                    },
                    byKemycal: function(kemycalSymbol) {
                        var allTubes = Lab.Util.Gather.Tubes.all();
                        var tubesByKemycal = [];
                        for (var tube in allTubes.Rack) {
                            var mixture = allTubes.Rack[tube].getMixture();
                            if (mixture.Kemycals.hasOwnProperty(kemycalSymbol)) {
                                tubesByKemycal.push(allTubes.Rack[tube]);
                            }
                        }
                        return new TubeRack(tubesByKemycal);
                    }
                },
                Kemycals: {
                    all: function() {
                        var allTubes = Lab.Util.Gather.Tubes.all();
                        var allKemycals = [];
                        for (var tube in allTubes.Rack) {
                            var mixture = allTubes.Rack[tube].getMixture();
                            mixture.each(function(kemycal) {
                                allKemycals.push(kemycal);
                            }.bind(allKemycals));
                        }
                        return new KemycalMixture(allKemycals);
                    },
                    bySymbol: function(kemycalSymbol) {
                        var testTubesByKemycal = Lab.Util.Gather.Tubes.byKemycal(kemycalSymbol);
                        var kemycalsBySymbol = [];
                        for (var tube in testTubesByKemycal.Rack) {
                            var mixture = testTubesByKemycal.Rack[tube].getMixture();
                            if (mixture.Kemycals.hasOwnProperty(kemycalSymbol)) {
                                kemycalsBySymbol.push(mixture.Kemycals[kemycalSymbol]);
                            }
                        }
                        return new KemycalMixture(kemycalsBySymbol);
                    }
                }
            },
        
            PhysicalCSS: {
                setup: function() {
                    var kemystryStyleTag = document.getElementById('kemystry-kemycals-physical-props');
                    if (kemystryStyleTag == null) {
                        head = document.head || document.getElementsByTagName('head')[0] || document.body || document.getElementsByTagName('body')[0];
                        var kemystryStyleTag = document.createElement('style');
                        kemystryStyleTag.id = 'kemystry-kemycals-physical-props';
                        kemystryStyleTag.type = 'text/css';
                        head.appendChild(kemystryStyleTag);
                    }
                    Lab.Util.PhysicalCSS.update();
                },
                add: function(symbol, state, style) {
                    if (!Lab.Workspace.Physical[symbol]) {
                        Lab.Workspace.Physical[symbol] = {};
                    }
                    Lab.Workspace.Physical[symbol][state] = style;
                },
                update: function() {
                    var kemystryStyleTag = document.getElementById('kemystry-kemycals-physical-props');
                    if (kemystryStyleTag != null) {
                        kemystryStyleTag.innerHTML = Lab.Util.PhysicalCSS.get();
                    } else {
                        Lab.Util.PhysicalCSS.setup();
                    }
                },
                get: function() {
                    return Lab.Util.PhysicalCSS.make.css();
                },
                make: {
                    attr: function(name, value) {
                        if (value == 'base') {}
                        return name + ': ' + value + ';\n';
                    },
                    attrs: function(object) {
                        cssAttrString = '';
                        for (var cssProp in object) {
                            cssAttrString += "\t" + Lab.Util.PhysicalCSS.make.attr(cssProp, object[cssProp]); //attr + ': ' + object[attr] + ';\n';
                        }
                        return cssAttrString;
                    },
                    css: function() {
                        var css = '';
                        for (var kemycalSymbol in Lab.Workspace.Physical) {
                            for (var kemycalState in Lab.Workspace.Physical[kemycalSymbol]) {
                                if (kemycalState == 'base') {
                                    css += '[data-kemy*=\"' + kemycalSymbol + ':\"] {\n' + Lab.Util.PhysicalCSS.make.attrs(Lab.Workspace.Physical[kemycalSymbol][kemycalState]) + "}\n";
                                } else {
                                    css += '[data-kemy*="' + kemycalSymbol + ':' + kemycalState + '"] {\n' + Lab.Util.PhysicalCSS.make.attrs(Lab.Workspace.Physical[kemycalSymbol][kemycalState]) + "}\n";
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
            _: function() {
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
                                break;
                            case 'string':
                                return checkThis.indexOf(search) !== -1;
                                break;
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
            },
        };
        Kemystry.Lab = Lab;
        return Kemystry;
    }(Kemystry || {}));
    Kemystry.open();
    document.addEventListener('DOMContentLoaded', Kemystry.setup);
    if (typeof define === "function" && define.amd) {
        define("kemystry", [], function() {
            return Kemystry;
        });
    }
    if (typeof noGlobal == typeof undefined) {
        window.Kemystry = Kemystry;
    }
    return Kemystry;
});