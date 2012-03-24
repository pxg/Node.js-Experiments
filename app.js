/**
 * Module dependencies.
 */
 
var express = require('express')
, jsdom = require('jsdom')
, request = require('request')
, url = require('url')
, app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function multilineTrim(htmlString) {
   // split the string into an array by line separator
   // call $.trim on each line
   // filter out the empty lines
   // join the array of lines back into a string
   console.log(htmlString);
   return htmlString.split("\n").map($.trim).filter(function(line) { return line != "" }).join("\n");
}

// Routes

app.get('/', function(req, res){
	
	request({uri: req.query.url || ''}, function(err, response, body){
                var self = this;
     			self.items = new Array();//I feel like I want to save my results in an array
 
      			//Just a basic error check
                if(err && response.statusCode !== 200){console.log('Request error.');}
                //Send the body param as the HTML code we will parse in jsdom
			      //also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
			      jsdom.env({
                        html: body,
                        scripts: ['http://code.jquery.com/jquery-1.6.min.js']
                }, function(err, window){
        			 //Use jQuery just as in a regular HTML page
                       
		            //Use jQuery just as in any regular HTML page
		            var $ = window.jQuery,
		                $body = $('body');
 
                        var sourceTable = $body.find('table.raceResults');
                        sourceTable.find('a').contents().unwrap();
                        sourceTable.find('td').removeAttr('nowrap');
                        var sourceHTML = $('<div>').append(sourceTable.clone()).remove().html();


                        res.render('index', {
		                  title: 'F1 Table Grabber',
		                  table : sourceHTML
		               });
                });
        });
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
