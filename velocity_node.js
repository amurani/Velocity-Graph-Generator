var fs = require('fs')
var canvg = require('canvg');
var jsdom = require('jsdom').jsdom;
var document = jsdom();

module.exports = {

	HEIGHT : 75,
	IMAGE_LOCATION : 'imgs/',

	getHeighest : function(data) {
		var heightest = data[0];
		for (var i in data)
			heightest = (data[i] > heightest) ? data[i] : heightest;
		return heightest;
	},

	getLowest : function(data) {
		var lowest = this.getHeighest(data);
		for (var i in data)
			lowest = (data[i] < lowest) ? data[i] : lowest;
		return lowest;
	},

	getFactor : function(data) {
		var heightest = this.getHeighest(data)
		var lowest = this.getLowest(data);
		var diff = heightest - lowest;
		diff = (diff == 0) ? 1 : diff;

		var factor = ( (1 / diff) * this.HEIGHT);
		return factor;
	},

	scaleData : function(data) {
		var factor = this.getFactor(data);
		for (var i = 0; i < data.length; i++)
			data[i] = data[i] * factor;
		return data;
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
		var factor = this.getFactor(data);
		data = this.scaleData(data);
		var h = this.HEIGHT;
		var w = data.length * range;
		var x = 0;
		var y = (factor == h) ? h / 2 : this.getHeighest(data) - data[0];

		var d = "M " + x + " " + y + " L ";

		svg.setAttribute('height', h + 'px');
		svg.setAttribute('width', w + 'px');

		for (var i = 0; i < data.length; i++) {
			x += range;
			y = (factor == h) ? h / 2 : this.getHeighest(data) - data[i];
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
		fs.writeFile(IMAGE_LOCATION + fileName + '.png', base64Img, 'base64', function(err) { console.log(fileName, err); });
	},

	generateGraph : function(data, file_name) {
		var svg = this.plotVgraph(data);
		var canvas = this.svgToCanvas(svg);
		var img = this.canvasToImg(canvas);
		this.saveImgToFile(file_name, img);
	}

};