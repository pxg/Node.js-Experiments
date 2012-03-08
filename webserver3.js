// node native module for http. https avaialable too
var http = require('http');

// annoymous callback function
var server = http.createServer(function(req, res) {
	// Add html content type
	res.setHeader("Content-Type", "text/html");
	
	// TODO: look for different URLs
	console.log(req.url);
	var i = 0;

	//setTimeout(function () {
	setInterval(function () {
  		//console.log('World');
  		res.write('<p>write firsttttt ' + i + '</p>');
  		i++;

  		if(i > 20){
  			//break;
  			//return false;
  			res.write('<p>larger</p>');
  			clearInterval()
  		}
	}, 100);

	res.write('<h1>Writing JavaScript makes me happy</h1>');
});

server.listen(8000);