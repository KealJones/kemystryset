/**
 * Pipette makes a new Kemycal Instance from the base properties defined by the Beaker.
 */
function Pipette(kemycalSymbol) {
    function takeProperties(obj) {
        var copy;
        // Handle the 2 simple types, and null or undefined
        if (null === obj || "object" != typeof obj) return obj;
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
        if (null === kemycalSource || "object" != typeof kemycalSource) return;
        // using takeProperties prevents copy by referance
        var kemycalSourceProperties = takeProperties(kemycalSource);
        var kemycalDrop = new Kemycal(kemycalSourceProperties);
        return kemycalDrop;
    }
    return false;
}