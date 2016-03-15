var Widget = require('./widget.js');
module.exports = class Table extends Widget{
	constructor( jsonString ){
		super();
		this.row = 0 ;
		this.column = 0;
	}
	setRow(row){
		this.row = row;
	}
	setColumn(column){
		this.column = column;
	}
	reflow(x,y,width,height){
		super.reflow(x,y,width,height);
		if( this.row * this.column != this.childrenWidget.length )
			throw new Error('Table的子Widget数据不对齐');
		var index = 0;
		
		for( var i = 0 ; i != this.row ; ++i ){	
			for( var j = 0 ; j != this.column ; ++j ){	
				var height = this.height / this.row;
				var width = this.width / this.column;
				var x = this.x+width * j;
				var y = this.y+height * i;
				this.childrenWidget[index++].reflow(
					x,
					y,
					width,
					height
				);
			}
		}
	}
	repaint(){
		super.repaint();
		for( var i in this.childrenWidget ){
			this.childrenWidget[i].repaint();
		}
	}
	composition(ctx){
		super.composition(ctx);
		for( var i in this.childrenWidget ){
			this.childrenWidget[i].composition(ctx);
		}
	}
};