module.exports = class Parser{
	constructor(){

	}
	_createXmlParser(xmlString){
		var docParser = null;
		if( window.ActiveXObject ){
			docParser = new ActiveXObject("Microsoft.XMLDOM"); 
			docParser.async = "false"; 
			docParser.load(xmlString); 
			return docParser;
		}else{
			docParser = new DOMParser() 
			return docParser.parseFromString(xmlString,"text/xml"); 
		}
	}
	_parseSingleDom(dom){
		var result = {};
		result.name = dom.nodeName;
		result.text = "";
		result.children = [];
		result.attributes = {};
		for( var i = 0 ; i != dom.attributes.length ; ++i ){
			var name = dom.attributes[i].nodeName;
			var value = dom.attributes[i].nodeValue;
			result.attributes[name] = value;
		}
		for( var i = 0 ; i != dom.childNodes.length ; ++i ){
			var node = dom.childNodes[i];
			if( node.nodeType == 3 ){
				result.text += node.nodeValue.trim();
			}else{
				result.children.push( this._parseSingleDom(node) );
			}
		}
		return result;
	}
	parse(xmlString){
		var dom = this._createXmlParser(xmlString);
		if( dom.childNodes.length == 0 )
			throw new Error('缺少根节点');
		var rootDom = dom.childNodes[0];
		return this._parseSingleDom(rootDom);
	}
};