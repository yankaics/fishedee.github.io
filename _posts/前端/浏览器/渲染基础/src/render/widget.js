module.exports = class Widget{
	constructor( ){
		this.width = 0;
		this.height = 0;
		this.x = 0;
		this.y = 0;
		this.canvas = document.createElement('canvas');
		this.canvasContext = this.canvas.getContext('2d');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.childrenWidget = [];
	}
	addChildWidget( widget ){
		this.childrenWidget.push( widget );
	}
	getChildWidgets( widget ){
		return this.childrenWidget;
	}
	reflow(x,y,width,height){
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		if( this.canvas.width != this.width )
			this.canvas.width = this.width;
		if( this.canvas.height != this.height )
			this.canvas.height = this.height;
	}
	repaint(){
	}
	composition(ctx){
		ctx.drawImage(this.canvas,this.x,this.y);
	}
};