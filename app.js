var velocity = require('./velocity.js');
var http = require('http');
var fs = require('fs');

function getCompanies(res) {
	var json = JSON.parse(res);
	var companies = [];
	var industries = json.industries;
	for (var i in industries) {
		var industry = industries[i];
		for (var j in industry.securities) {
			var security = industry.securities[j];
			companies.push(security.ticker);
		}
	}
	return companies;
}

function getPrices(companyData) {
	var prices = [];
	companyData = JSON.parse(companyData);
	for (var i in companyData) { prices.push(companyData[i].previous_day_price); }
	prices = prices.filter(function (i) { if (i != undefined) return i; });
	return prices;
}

function generateVelocityGraph(company) {
	var url = 'http://wekeza.co/api/v1/market_securities/' + company + '/historical.json';
	http.get(url, function(res) {
	  var body = '';
	  res.on('data', function(chunk) { body += chunk; });
	  res.on('end', function() {
	   	var prices = getPrices(body);
	   	if (prices.length > 0) {
				var svg = velocity.plotVgraph(prices);
				var canvas = velocity.svgToCanvas(svg);
				var img = velocity.canvasToImg(canvas);
				velocity.saveImgToFile(company, img);
			}
	  });
	}).on('error', function(err) { if (err) console.log(err); });
}

var url = 'http://wekeza.co/api/v1/market_securities?snapshot=true';
http.get(url, function(res) {
  var body = '';
  res.on('data', function(chunk) { body += chunk; });
  res.on('end', function() {
   	var companies = getCompanies(body);
		for (var i = 0; i < companies.length; i++) {
			generateVelocityGraph(companies[i]);
		}
  });
}).on('error', function(err) { if (err) console.log(err); });