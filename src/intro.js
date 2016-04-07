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
        var Kemystry = (function(Kemystry) {
                    //Shorthands
                    var KEMYSTRY_DATATAG_NAME = 'data-kemy',
                        KEMYCAL_SEPARATOR = ' ',
                        KEMYCAL_KEY_VALUE_SEPARATOR = ':',
                        KEMYCAL_MULTIPLE_VALUES_SEPARATOR = ',',
                        KEMYCAL_PROPERTY_TAG_NAME = 'symbol',
                        KEMYCAL_PROPERTY_METHODS_NAME = 'procedures',
                        REQUIRED_KEMYCAL_PROPERTIES = ['name'];