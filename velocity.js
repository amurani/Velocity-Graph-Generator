var fs = require('fs')
var canvg = require('canvg');
var jsdom = require('jsdom').jsdom;
var document = jsdom();

module.exports = {

	getHeightest : function(data) {
		var heightest = data[0];
		for (var i in data)
			heightest = (data[i] > heightest) ? data[i] : heightest;
		return heightest;
	},

	getLowest : function(data) {
		var lowest = this.getHeightest(data);
		for (var i in data)
			lowest = (data[i] < lowest) ? data[i] : lowest;
		return lowest;
	},

	drawPath : function(d) {
		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute("style", "fill: transparent; stroke: #06c; stroke-width: 2;");
		path.setAttribute("d", d);
		return path;
	},

	plotVgraph : function(data) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		var range = 1;
		var factor = 7;
		var h = this.getHeightest(data) + this.getLowest(data);
		var w = data.length * range;
		var x = 0;
		var y = data[0] * factor;
		var d = "M " + x + " " + y + " L ";

		svg.setAttribute('height', (h * factor) + 'px');
		svg.setAttribute('width', w + 'px');

		for (var i = 0; i < data.length; i++) {
			x += range;
			y = data[i] * factor;
			d += x + " " + y + ", ";
		}
		d = d.substr(0, d.length - 2);

		var path = this.drawPath(d);
		svg.appendChild(path);

		return svg;
	},

	svgToCanvas : function(svg) {
		var canvas = document.createElement('canvas');

		canvas.height = svg.getAttribute('height');
		canvas.width = svg.getAttribute('width');

		canvg(canvas, svg.outerHTML);

		return canvas;
	},

	canvasToImg : function(canvas) {
	  var dataURL = canvas.toDataURL("image/png");
		return dataURL;
	},

	saveImgToFile : function(fileName, base64Img) {
		base64Img = base64Img.replace(/^data:image\/png;base64,/, "");
		fs.writeFile('imgs/' + fileName + '.png', base64Img, 'base64', function(err) { console.log(err); });
	}

};