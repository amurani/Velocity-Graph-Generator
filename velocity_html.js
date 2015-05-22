var velocity = {

	HEIGHT : 75,

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

	drawName : function(name) {
		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute('x', 0);
		text.setAttribute('y', 15);
		text.innerHTML = name
		return text;
	},

	plotVgraph : function(data, name) {
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

		if (name != undefined) {
			var text = this.drawName(name);
			svg.appendChild(text);
		}

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
		var img = new Image();
		img.src = canvas.toDataURL("image/png");
		return img;
	}

};