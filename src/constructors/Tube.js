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
        this.element.setAttribute(KEMYSTRY_DATATAG_NAME, Lab.Tools.Deriver.underive(this.mixture.Kemycals));
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
    }
};