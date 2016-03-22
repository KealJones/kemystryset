KemystrySet.beaker({
    // Simple Size Utility Kemycal, No more need for grid classes!
    symbol: 'size',
    procedures: {
        act: function(){
            var fraction = this.state().split('/');
            this.physical({'width':(fraction[0]/fraction[1])*100+'%'});
        }
    }
});