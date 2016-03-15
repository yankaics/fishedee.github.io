var Network = require('./network/network.js');
var Parser = require('./parser/parser.js');
var Render = require('./render/render.js');

//创建canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var render = null;

function refresh(){
	canvas.width = window.innerWidth/2;
	canvas.height = window.innerHeight;

	render && render.render(
		ctx,
		canvas.width,
		canvas.height
	);
}

//被动触发渲染
window.onresize = refresh;

//主动触发渲染
window.Canvas = {
	update:function(data){
		var data = new Parser().parse(data);
		render = new Render(data);
		refresh();
	}
};