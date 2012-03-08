// node native module for http. https avaialable too
var http = require('http');

// annoymous callback function
var server = http.createServer(function(req, res) {
	// Add html content type
	res.setHeader("Content-Type", "text/html");
	
	// TODO: look for different URLs
	console.log(req.url);

	//setTimeout(function () {
	setInterval(function () {
  		//console.log('World');
  		res.write('<p>write first</p>');
  		// TODO count a var here
	}, 100);

	res.write('<h1>Writing JavaScript makes me happy</h1>');
});

server.listen(8000);