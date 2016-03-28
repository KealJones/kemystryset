Kemystry.beaker({
    // Simple Size Utility Kemycal, No more need for grid classes!
    symbol: 'size',
    user_extensive: false,
    procedures: {
        act: function(){
            var fraction = this.state().split('/');
            this.phys({'width':(fraction[0]/fraction[1])*100+'%'});
        }
    }
});