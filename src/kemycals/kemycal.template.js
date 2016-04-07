Kemystry.beaker({
    // This is a Blank Template of all possible properties a Kemycal can have.
    symbol: '', // This is a short identifier for the Kemycal. Try to keep it short only a few letters.
    react_on: [], // An Array of any event name that can be used in addEventListener can be added to this.
    extensive: { // Extensive properties is a deligated object for you and users to set configs, state reactions, anything. 
        aProperty: 'some value',
        anotherProperty: {
            asubObjectProperty: 5
        }
    },
    user_extensive: true, // This property by default is set to (true) if you set to false, users cannot manipulate "extensive" properties with the beaker().prep() function.
    physical: {

    }
    procedures: { // Procedures are a set of functions that the Kemycal can have performed on it. 
        prep: function() {
            // 'prep()' will only run once and is usually used for preparing your Kemycal. 
            // ex. Set physical properties, change extensive properties, anything.
            // DOM may be loaded and your access to TestTubes may be limited.
        },
        act: function() {
            // 'act()' will be executed on every instance of this Kemycal one time once the DOM is ready.
        },
        react: function(eventName) {
            // 'react()' will be called when any of the 'react_on' events happens.
            // The 'eventName' parameter is only the name, such as 'click', not an entire event object for simplicity.
            // to handle different events simply do a switch or whatever your heart desires.
        },
        // You can add your own custom "procedures" to a kemycal if you want more added functionality.
        // These procedures are accessed by calling this.procedure('customProcedure',arg1,arg2,etc);
        customProcedure: function(arg1,arg2) {

        }
    },
});