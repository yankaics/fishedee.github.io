var Table = require('./table.js');
var Span = require('./span.js');
var Widgets = {
	'table':Table,
	'span':Span
};
module.exports = class Render{
	constructor( jsonString ){
		this.widget = this.createWidgetFromJson(jsonString);
	}
	createWidgetFromJson( jsonString ){
		//创建Widget
		var name = jsonString.name;
		if( Widgets.hasOwnProperty(name) == false )
			throw new Error('缺少Widget的名字为'+name);
		var WidgetClass = Widgets[name];
		var widget = new WidgetClass();
		//设置Text
		var text = jsonString.text;
		if( text != "" ){
			if( !widget.setText )
				throw new Error('Widget缺少setText属性'+name+":"+text);
			widget.setText(text);
		}
		//设置属性
		for( var i in jsonString.attributes ){
			var name = i;
			var value = jsonString.attributes[i];
			var functionName = "set"+name.substring(0,1).toUpperCase()+name.substring(1);
			if( !widget[functionName] )
				throw new Error("Widget缺少"+functionName+"属性"+name+":"+value);
			widget[functionName](value);
		}
		//设置子控件
		for( var i in jsonString.children ){
			var singleChild = this.createWidgetFromJson(
				jsonString.children[i]
			);
			widget.addChildWidget( singleChild );
		}
		return widget;

	}
	render(ctx,width,height){
		//清除ctx
		ctx.clearRect(0,0,width,height);
		//绘图
		this.widget.reflow(0,0,width,height);
		this.widget.repaint();
		this.widget.composition(ctx);
	}
};