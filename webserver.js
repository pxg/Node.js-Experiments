// node native module for http. https avaialable too
var http = require('http');

// annoymous callback function
var server = http.createServer(function(req, res) {
	res.end('Non-blocking rockstar tech');
	console.log(req);
});

server.listen(8000);
