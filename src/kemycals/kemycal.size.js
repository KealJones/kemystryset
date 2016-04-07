Kemystry.beaker({
    // Simple Size Utility Kemycal, No more need for grid classes!
    symbol: 'size',
    extensive: {
    	float:false,
    },
    procedures: {
    	prep: function(){
    		if (this.ext('float')){
    			this.phys({'float':'left'}, 'base');
    		}
    	},
        act: function(){
        	if (this.state().indexOf('/') > -1){
        		var fraction = this.state().split('/');
            	this.phys({'width':(fraction[0]/fraction[1])*100+'%'});
        	} else {
        		this.phys({'width':this.state()});
        	}
            
        }
    }
});