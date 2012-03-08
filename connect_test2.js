var connect = require('connect');

// switch port number based on environmnet variable
console.log(process.env.appenv);

if(process.env.appenv == 'pxg-air'){
	var port = 8000;
}else{
	var port = 8080;
}
console.log(port);

var routes = function (app) {
	app.get("/remy/:prop", function (req, res) {
		res.end('you were looking for something like ' + req.params.prop);
	});

	app.get('/adam', function (req, res) {
 		// serve custom content
 		res.end('Woooh routing!');
	});
	app.get('/pete', function (req, res) {
 		// serve custom content
 		//res.writeHead(404, { 'content-type'})
 		res.end('this is not the pete you are looking for');
	});
};

var server = connect.createServer(
	connect.logger(),
	connect.basicAuth('pete', '123456'),
	connect.directory(__dirname + '/public'),
 	connect.static(__dirname + '/public'),
 	connect.router(routes)
);
server.listen(port);