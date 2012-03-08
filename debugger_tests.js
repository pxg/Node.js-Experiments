// node native module for http. https avaialable too
var http = require('http');
var url = require('url').parse('http://2011.full-frontal.org/schedule');

// make request for webpage
//var server = http.createServer(function(req, res) {
var req = http.request(url, function(res) {
	debugger;
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADDERS ' + JSON.stringify(res.headers));

	res.setEncoding('utf8');
	var body = '';

	res.on('data', function(chunk) {
		console.log('BODY: ' + chunk);
		body += chunk;
	});
});

req.on('errror', function(e){
	console.log('ERRRRROR');
});

req.end();

