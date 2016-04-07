/**
 * TubeRack is an array of Tube Instances
 */
function TubeRack(els) {
    var TubeElements = [];
    for (var el in els) {
        if (els.hasOwnProperty(el)){
        if (els[el] instanceof Tube) {
            TubeElements.push(els[el]);
        } else {
            TubeElements.push(new Tube(els[el]));
        }
    }
    }
    this.Rack = TubeElements;
}
TubeRack.prototype = {
    each: function(proc) {
        for (var tube in this.Rack) {
            proc(this.Rack[tube]);
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