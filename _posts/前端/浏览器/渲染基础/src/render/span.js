var Widget = require('./widget.js');
module.exports = class Span extends Widget{
	constructor( jsonString ){
		super();
		this.text = '';
		this.fontSize = '16px';
		this.color = 'black';
	}
	setText(text){
		this.text = text;
	}
	setFontSize(fontSize){
		this.fontSize = fontSize;
	}
	setColor(color){
		this.color = color;
	}
	reflow(x,y,width,height){
		super.reflow(x,y,width,height);
		if( this.childrenWidget.length != 0 )
			throw new Error("span标签下不能嵌套子控件");
	}
	repaint(){
		super.repaint();
		this.canvasContext.clearRect(0,0,this.width,this.height);

		this.canvasContext.fillStyle = this.color;
		this.canvasContext.font = this.fontSize+' sans-serif';

		var textMeasure = this.canvasContext.measureText(this.text);
		var textX = (this.width - textMeasure.width)/2;
		var textY = (this.height - parseInt(this.fontSize))/2;
		
		this.canvasContext.fillText(this.text,textX,textY);
	}
	composition(ctx){
		super.composition(ctx);
	}
};