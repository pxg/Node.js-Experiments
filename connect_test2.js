var connect = require('connect');
var count = 0;

var routes = function (app) {
	app.get("/count", function (req, res) {
		count++;
		res.end(req.count.toString());
	});
}

// once node starts this continues to loop. As server continues to listen. Unlike PHP
var server = connect.createServer(
	connect.logger(),

	function(req, res, next){

		if(req.url != 'favicon.ico'){
			count++;
		}
		req.count = count;
		next();

	},
	connect.router(routes),
	// could chain multiple middleware here
	connect.basicAuth('pete', '123456'),
	connect.directory(__dirname + '/public'),
 	connect.static(__dirname + '/public')
);
server.listen(8000);