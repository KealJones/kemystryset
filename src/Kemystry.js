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
        /////////////////////////////////////////////////////////
        // Public API
        /////////////////////////////////////////////////////////
        Kemystry = {
            workArea: {},
            open: function() {
                Kemystry.workArea = document;
                Kemystry.Deriver = myself.Deriver;
                head = document.head || document.getElementsByTagName('head')[0];
                var kemycalPhysicalProperties = document.getElementById('kemycal_physical_properties');
                if (kemycalPhysicalProperties == null) {
                    var kemycalPhysicalProperties = document.createElement('style');
                    kemycalPhysicalProperties.id = 'kemycal_physical_properties';
                    kemycalPhysicalProperties.type = 'text/css';
                    head.appendChild(kemycalPhysicalProperties);
                }
            },
            setup: function() {
                myself._kit.tubes = myself._findAllTestTubes();
                myself._kit.tubes.each(function(tube) {
                    tube.mixture().each(function(kemycal) {
                        kemycal.act();
                    });
                });
            },
            beaker: function(kemycalProperties) {
                if (typeof kemycalProperties == 'object') {
                    var beaker = myself._kit.beakers[kemycalProperties.symbol.toLowerCase()] = new Kemycal(kemycalProperties);
                    return beaker;
                } else {
                    if (kemycalProperties && myself._kit.beakers.hasOwnProperty(kemycalProperties.toLowerCase())) {
                        return {
                            prep: function(extProps) {
                                myself._kit.beakers[kemycalProperties.toLowerCase()].prep(extProps);
                            }
                        };
                    }
                }
            },
            setWorkArea: function(selector) {
                var workArea,
                    wholeArea = document;
                try {
                    if (selector === 'document') {
                        workArea = wholeArea;
                    } else {
                        workArea = wholeArea.querySelector(selector);
                        if (!workArea) {
                            workArea = wholeArea;
                        }
                    }
                } catch (e) {
                    workArea = wholeArea;
                }
                Kemystry.workArea = workArea;
            }
        };
        /**
         * TestTube is a DOM element that has the DATATAG attribute.
         */
        function TestTube(el) {
            var _ = myself._secretLab();
            _(this).testtube = el;
            _(this).mixture = new KemycalMixture(_(this).testtube.getAttribute(KEMYSTRY_DATATAG_NAME));
            for (var kemycal in _(this).mixture.Kemycals) {
                var kemycalInst = _(this).mixture.Kemycals[kemycal];
                _(kemycalInst).tube = this;
                //kemycalInst.act();
                if (_(kemycalInst).properties.intensive.hasOwnProperty('react_on')) {
                    for (var event in _(kemycalInst).properties.intensive.react_on) {
                        var eventName = _(kemycalInst).properties.intensive.react_on[event];
                        (function(tube, kemycal, event) {
                            tube.addEventListener(event, function() {
                                kemycal.react(event)
                            })
                        })(_(this).testtube, kemycalInst, eventName)
                    }
                }
            }
        }
        TestTube.prototype = {
            mixture: function() {
                var _ = myself._secretLab();
                return _(this).mixture;
            },
            updateFormula: function() {
                var _ = myself._secretLab();
                _(this).testtube.setAttribute(KEMYSTRY_DATATAG_NAME, myself.Deriver.underive(_(this).mixture.Kemycals));
                return this;
            },
            content: function(contentValue) {
                var _ = myself._secretLab();
                if (contentValue) {
                    _(this).testtube.innerHTML = contentValue;
                    return this;
                }
                return _(this).testtube.innerHTML;
            }
        };
        /**
         * Kemycals are like plugins. They have special properties and abilities to do a variety of things.
         */
        function Kemycal(kemycalProperties) {
            var _ = myself._secretLab();
            _(this).properties = {};
            kemycalPropertiesSetter = {};
            if (kemycalProperties.hasOwnProperty('intensive') && kemycalProperties.hasOwnProperty('extensive')) {
                _(this).properties = kemycalProperties;
                return this;
            }
            kemycalProperties[KEMYCAL_PROPERTY_TAG_NAME] = kemycalProperties[KEMYCAL_PROPERTY_TAG_NAME].toLowerCase();
            kemycalPropertiesSetter.intensive = kemycalProperties;
            kemycalPropertiesSetter.extensive = {};
            if (kemycalPropertiesSetter.intensive.hasOwnProperty('extensive')) {
                kemycalPropertiesSetter.extensive = kemycalPropertiesSetter.intensive['extensive'];
                delete kemycalPropertiesSetter['intensive'].extensive;
            }
            _(this).properties = kemycalPropertiesSetter;
            return this;
        }
        Kemycal.prototype = {
            prep: function(userExtensive) {
                var _ = myself._secretLab();
                extendExtensive = function(destination, source) {
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
                extendExtensive(this.extensive(), userExtensive);
                return this;
            },
            act: function() {
                var _ = myself._secretLab();
                if (_(this).properties.intensive.hasOwnProperty('procedures') && _(this).properties.intensive.procedures.hasOwnProperty('act')) {
                    _(this).properties.intensive.procedures.act.apply(this, arguments);
                }
                return this;
            },
            react: function() {
                var _ = myself._secretLab();
                if (_(this).properties.intensive.hasOwnProperty('procedures') && _(this).properties.intensive.procedures.hasOwnProperty('react')) {
                    _(this).properties.intensive.procedures.react.apply(this, arguments);
                }
                return this;
            },
            symbol: function() {
                var _ = myself._secretLab();
                return _(this).properties.intensive.symbol;
            },
            state: function(kemycalState) {
                var _ = myself._secretLab();
                if (kemycalState) {
                    _(this).state = kemycalState;
                    if (_(this).hasOwnProperty('tube')) {
                        _(this).tube.updateFormula();
                    }
                    return this;
                }
                return _(this).state;
            },
            extensive: function(propKey, propValue) {
                var _ = myself._secretLab();
                if (propKey) {
                    if (typeof propKey == 'object') {
                        for (var propertyName in propKey) {
                            _(this).properties.extensive(propertyName, propKey[propertyName]);
                        }
                        return _(this).properties.extensive;
                    } else {
                        if (propValue) {
                            _(this).properties.extensive[propKey] = propValue;
                            return _(this).properties.extensive[propKey];
                        }
                        return _(this).properties.extensive[propKey];
                    }
                }
                return _(this).properties.extensive;
            },
            physical: function(style, state) {
                var _ = myself._secretLab();
                if (state == undefined) {
                    state = myself.Deriver.underiveState(this.state());
                }
                var kemycalPhysicalProperties = document.getElementById('kemycal_physical_properties');
                if (!myself._kit.physical_properties[_(this).properties.intensive.symbol]) {
                    myself._kit.physical_properties[_(this).properties.intensive.symbol] = {};
                }
                myself._kit.physical_properties[_(this).properties.intensive.symbol][state] = style;
                css = myself._getCSS();
                kemycalPhysicalProperties.innerHTML = css;
                return this;
            },
            content: function(content) {
                var _ = myself._secretLab();
                _(this).tube.content(content);
                return this;
            },
            tube: function() {
                var _ = myself._secretLab();
                return _(this).tube;
            },
            others: function() {
                var _ = myself._secretLab();
                var others = myself._findAllKemycalsBySymbol(this.symbol());
                for (var kemycal in others.Kemycals) {
                    if (others.Kemycals[kemycal].__labId == this.__labId) {
                        others.Kemycals.splice(kemycal, 1);
                    }
                }
                return others;
            }
        };
        /**
         * KemycalMixture is an array of Kemycal Instances
         */
        function KemycalMixture(kemycalFormula) {
            if (kemycalFormula instanceof Array) {
                var mixtureKemycals = [];
                for (var kemycal in kemycalFormula) {
                    mixtureKemycals.push(kemycalFormula[kemycal]);
                }
            } else {
                var mixtureKemycals = {};
                var derivedFormula = myself.Deriver.derive(kemycalFormula);
                var formulaSymbols = [];
                for (var symbol in derivedFormula) formulaSymbols.push(symbol.toLowerCase());
                for (var i = 0, kemycalSymbol; kemycalSymbol = formulaSymbols[i]; i++) {
                    var pipette = Pipette(kemycalSymbol);
                    if (pipette != false) {
                        mixtureKemycals[kemycalSymbol] = pipette;
                        mixtureKemycals[kemycalSymbol].state(derivedFormula[kemycalSymbol]);
                    }
                }
            }
            this.Kemycals = mixtureKemycals;
            var iteratedProcedures = [],
                mythis = this;

            function getIteratedProc(proc) {
                return function() {
                    for (var j = 0, kemycal; kemycal = mythis.Kemycals[j]; j++) {
                        kemycal[proc].apply(kemycal, arguments);
                    }
                    return mythis;
                };
            };
            for (var i = 0, procedure; procedure = iteratedProcedures[i]; i++) {
                this[procedure] = getIteratedProc(procedure);
            }
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
            var _ = myself._secretLab();

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
            if (myself._kit.beakers.hasOwnProperty(kemycalSymbol)) {
                var kemycalSource = myself._kit.beakers[kemycalSymbol];
                if (null == kemycalSource || "object" != typeof kemycalSource) return;
                // using takeProperties prevents copy by referance
                var kemycalSourceProperties = takeProperties(_(kemycalSource).properties);
                var kemycalDrop = new Kemycal(kemycalSourceProperties);
                return kemycalDrop;
            }
            return false;
        }
        /**
         * TestTubeRack is an array of TestTube Instances
         */
        function TestTubeRack(els) {
            var TestTubeElements = [];
            for (var i = 0, el; el = els[i]; i++) {
                if (el instanceof TestTube) {
                    TestTubeElements.push(el);
                } else {
                    TestTubeElements.push(new TestTube(el));
                }
            }
            this.Rack = TestTubeElements;
            var iteratedProcedures = [],
                mythis = this;

            function getIteratedProc(proc) {
                return function() {
                    for (var j = 0, tube; tube = mythis.Rack[j]; j++) {
                        tube[proc].apply(tube, arguments);
                    }
                    return mythis;
                };
            };
            for (var i = 0, procedure; procedure = iteratedProcedures[i]; i++) {
                this[procedure] = getIteratedProc(procedure);
            }
        }
        TestTubeRack.prototype = {
            each: function(proc) {
                for (var i = 0, tube; tube = this.Rack[i]; i++) {
                    proc(tube);
                }
            },
            get: function(offset) {
                return this.Rack[offset];
            },
            size: function() {
                return Object.keys(this.Rack).length;
            }
        };
        /********************************************************
         * Private Methods and Vars
         ********************************************************/
        var myself = {};
        myself._kit = {
            beakers: {},
            tubes: {},
            physical_properties: {}
        };
        myself._secretLabStorage = {};
        myself._secretLabSeen = {};
        myself._secretLab = function(key) {
            var store = myself._secretLabStorage;
            var seen = myself._secretLabSeen;
            return function(key) {
                if (typeof key != 'object') return;
                if (!key.hasOwnProperty('__labId')) {
                    key.__labId = myself._makeLabId();
                }
                key = key.__labId;
                var value = store[key];
                if (!value) {
                    if (seen.hasOwnProperty(key)) {
                        value = key;
                    } else {
                        value = Object.create(Object.prototype);
                        store[key] = value;
                        seen[value] = true;
                    }
                }
                return value;
            };
        };
        myself._findAllTestTubes = function() {
            var kemystrySetDataTagName = '[' + KEMYSTRY_DATATAG_NAME + ']';
            this._kit.tubes = new TestTubeRack(Kemystry.workArea.querySelectorAll(kemystrySetDataTagName));
            return this._kit.tubes;
        };
        myself._findTestTubesByKemycal = function(kemycalSymbol) {
            var tubes = [];
            for (var tube in myself._kit.tubes.Rack) {
                var mixture = myself._kit.tubes.Rack[tube].mixture();
                if (mixture.Kemycals.hasOwnProperty(kemycalSymbol)) {
                    tubes.push(myself._kit.tubes.Rack[tube]);
                }
            }
            return new TestTubeRack(tubes);
        };
        myself._findAllKemycalsBySymbol = function(kemycalSymbol) {
            var tubes = myself._findTestTubesByKemycal(kemycalSymbol);
            var kemycals = [];
            for (var tube in tubes.Rack) {
                var mixture = myself._kit.tubes.Rack[tube].mixture();
                if (mixture.Kemycals.hasOwnProperty(kemycalSymbol)) {
                    kemycals.push(mixture.Kemycals[kemycalSymbol]);
                }
            }
            return new KemycalMixture(kemycals);
        };
        myself._makeLabId = function() {
            var dateObject = new Date();
            var uniqueId = (Math.random() * dateObject.getTime()).toString(36).substring(9);
            return uniqueId;
        };
        myself._getCSS = function() {
            var css = '';
            for (var prop in myself._kit.physical_properties) {
                for (var val in myself._kit.physical_properties[prop]) {
                    if (val == 'base') {
                        css += '[data-kemy*=\"' + prop + ':\"] {\n' + myself._toCSSAttributes(myself._kit.physical_properties[prop][val]) + "}\n";
                    } else {
                        css += '[data-kemy*="' + prop + ':' + val + '"] {\n' + myself._toCSSAttributes(myself._kit.physical_properties[prop][val]) + "}\n";
                    }
                }
            }
            /*for (var attr in object){
                if (object[attr] instanceof Object || object[attr] instanceof Array){
                    //for (var attr in )
                }
            }*/
            return css;
        };
        myself._toCSS = function(name, value) {
            if (value == 'base') {}
            return name + ': ' + value + ';\n';
        };
        myself._toCSSAttributes = function(object) {
            cssAttrString = '';
            for (var attr in object) {
                cssAttrString += "\t" + attr + ': ' + object[attr] + ';\n';
            }
            return cssAttrString;
        };
        myself.Deriver = {
            derive: function(kemycalFormula) {
                return this.deriveFormula(kemycalFormula);
            },
            deriveFormula: function(formula) {
                var derivedFormula = {},
                    definitionCollection,
                    derivedKemycal;
                var kemycalCollection = formula.split(KEMYCAL_SEPARATOR);
                var size = kemycalCollection.length,
                    i = 0;
                for (i; i < size; i++) {
                    derivedKemycal = this.deriveKemycal(kemycalCollection[i]);
                    derivedFormula[derivedKemycal.symbol] = derivedKemycal.state;
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
        };
        return Kemystry;
    }(Kemystry || {}));
    Kemystry.open();
    document.addEventListener('DOMContentLoaded', Kemystry.setup);
    if (typeof define === "function" && define.amd) {
        define("kemystryset", [], function() {
            return Kemystry;
        });
    }
    if (typeof noGlobal == typeof undefined) {
        window.Kemystry = Kemystry;
    }
    return Kemystry;
});