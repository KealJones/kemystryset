/**
 * Beaker is used to create a base Kemycal.
 */
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