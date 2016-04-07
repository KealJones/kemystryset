/**
 * KemycalMixture is an array of Kemycal Instances
 */
function KemycalMixture(kemycalFormula) {
    if (kemycalFormula instanceof Array) {
        var tempMixedKemycalsArray = [];
        for (var kemycal in kemycalFormula) {
            tempMixedKemycalsArray.push(kemycalFormula[kemycal]);
        }
         this.Kemycals = tempMixedKemycalsArray;
    } else {
        var tempMixedKemycalsObject = {};
        var derivedFormula = Lab.Tools.Deriver.derive(kemycalFormula);
        for (var kemycalSymbol in derivedFormula) {
            var pipette = Pipette(kemycalSymbol);
            if (pipette !== false) {
                tempMixedKemycalsObject[kemycalSymbol] = pipette;
                tempMixedKemycalsObject[kemycalSymbol].state(derivedFormula[kemycalSymbol]);
            }
        }
        this.Kemycals = tempMixedKemycalsObject;
    }
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