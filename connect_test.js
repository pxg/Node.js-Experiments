var connect = require('connect');

// switch port number based on environmnet variable
console.log(process.env.appenv);

if(process.env.appenv == 'pxg-air'){
	var port = 8000;
}else{
	var port = 8080;
}
console.log(port);

var server = connect.createServer(
	connect.logger(),
	connect.directory(__dirname + '/public'),
	//connect.favicon(),
 	connect.static(__dirname + '/public')
);
server.listen(port);
//server.listen(8000);