// node native module for http. https avaialable too
var http = require('http');

// annoymous callback function
var server = http.createServer(function(req, res) {
	// Add html content type
	res.setHeader("Content-Type", "text/html");
	
	// TODO: look for different URLs
	console.log(req.url);
	if(req.url == '/pxg'){
		res.end('<h1>pxg is  the best</h1>');
	}else{
		res.end('<h1>Writing JavaScript makes me happy</h1>');
	}
});

server.listen(8000);
