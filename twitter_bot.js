// Taken from http://www.fusioncube.net/index.php/node-js-basics-and-twitter-search

// 1. connect to twitter
// 2. search for tweets mentioning "ric flair"
// 3. reply to user @woooh
// 4. record tweet id in mongo db so we don't repeat the action
// do we need extra code to check if we hit the api limit?

// Include all Node modules needed for this example
var http = require("http"),
  url=require("url"),
  path=require("path"),
  fs=require("fs"),
  events=require("events"),
  sys = require("sys");
  
/**
 * Handle the serving of files with static content
 * 
 * @param {Object} uri
 * @param {Object} response
 */
function load_static_web_file(uri, response) {
  var filename = path.join(process.cwd(), uri);
    
  // If path.exists function takes a string parameter - which is a path to
  // the document being requested - and a function which gets passed a boolean
  // argument which is true if a file at the path exists, and false if it doesn't
  path.exists(filename, function(exists) {
    
    // File not found. Return a 404 error.
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("Four Oh Four! Wherefour art thou?");
            response.end();
            return;
        }
        
    // File does exist. Execute the FileSystem.readFile() method
    // with a closure that returns a 500 error if the file could not
    // be read properly.
        fs.readFile(filename, "binary", function(err, file) {
      
      // File could not be read, return a 500 error.
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err+"\n");
                response.end();
                return;
            }
            
      // File was found, and successfully read from the file system.
      // Return a 200 header and the file as binary data.
            response.writeHead(200);
            response.write(file, "binary");
      
      // End the response.
            response.end();
        });
    });
}

var Twitter = (function(){
    var eventEmitter = new events.EventEmitter();
  
    return {
        EventEmitter : eventEmitter,  // The event broadcaster
        latestTweet : 0               // The ID of the latest searched tweet    
    };
})();

/**
 * Pings the Twitter Search API with the specified query term
 * 
 * @param {Object} query
 */
function get_tweets(query) {
  
  // Send a search request to Twitter
  var request = http.request({
    host: "search.twitter.com",
    port: 80,
    method: "GET",
    path: "/search.json?since_id=" + Twitter.latestTweet + "result_type=recent&rpp=5&q=" + query
  })
  
  /* 
   * When an http request responds, it broadcasts the response() event, 
   * so let's listen to it here. Now, this is just a simple 'Hey, I got 
   * a response' event, it doesn't contain the data of the response.
   */
  .on("response", function(response){
    var body = "";
    
    /*
     * Now as the the response starts to get chunks of data streaming in
     * it will broadcast the data() event, which we will listen to. When
     * we receive data, append it to a body variable. 
     */
    response.on("data", function(data){
      body += data;
      
      try {
        /*
         * Since the Twitter Search API is streaming, we can't listen to 
         * the end() method, so I've got some logic where we try to parse
         * the data we have so far. If it can't be parsed, then the 
         * response isn't complete yet.
         */
        var tweets = JSON.parse(body);
        
        /*
         * The data was successfully parsed, so we can safely assume we 
         * have a valid structure.
         */
        if (tweets.results.length > 0) {
          /*
           * We actually got some tweets, so set the Twitter.latestTweet 
           * value to the ID of the latest one in the collection.
           */ 
          Twitter.latestTweet = tweets.max_id_str;

          /*
           * Remember, node.js is an event based framework, so in order 
           * to get the tweets back to the client, we need to broadcast 
           * a custom event named 'tweets'. There's a function listening 
           * for this event in the createServer() function (see below).
           */ 
          Twitter.EventEmitter.emit("tweets", tweets);

          // loop tweets (do we have the user that sent them?)
          // get username and call function to send @reply (do as seperate file first)
        }
        
        /*
         * I'm clearing all object listening for the 'tweets' event here to 
         * clean up any listeners created on previous requests that did not 
         * find any tweets.
         */
        Twitter.EventEmitter.removeAllListeners("tweets");
      } 
      catch (ex) {
        /*
         * If we get here, it's because we received data from the request, 
         * but it's not a valid JSON struct yet that can be parsed into an 
         * Object.
         */
        console.log("waiting for more data chunks...");
      }
    });
  });

  // End the request
  request.end();
}

/**
 * Create an HTTP server listening on port 8124
 * 
 * @param {Object} request
 * @param {Object} response
 */
http.createServer(function (request, response) {
  // Parse the entire URI to get just the pathname
  var uri = url.parse(request.url).pathname, query;
  
  // If the user is requesting the Twitter search feature
  if(uri === "/twitter") {
  
        /*
         * On each request, if it takes longer than 20 seconds, end the response 
         * and send back an empty structure.
         */
        var timeout = setTimeout(function() {  
            response.writeHead(200, { "Content-Type" : "text/plain" });  
            response.write(JSON.stringify([]));  
            response.end();  
        }, 20000);
  
      /*
       * Register a listener for the 'tweets' event on the Twitter.EventEmitter.
       * This event is fired when new tweets are found and parsed. 
       *      (see get_tweets() method above) 
       */
    Twitter.EventEmitter.once("tweets", function(tweets){
            // Send a 200 header and the tweets structure back to the client
      response.writeHead(200, {
        "Content-Type": "text/plain"
      });
      response.write(JSON.stringify(tweets));
      response.end();
      
      // Stop the timeout function from completing (see below)
      clearTimeout(timeout);
    });

        // Parse out the search term
        query = request.url.split("?")[1];
    
        // Search for tweets with the search term
        get_tweets(query);
  
  /*
   * For all other requests, try to return a static page by calling the 
   * load_static_web_file() function.
   */ 
    } else {  
        load_static_web_file(uri, response);  
    }
}).listen(8124);

// Put a message in the console verifying that the HTTP server is up and running
console.log("Server running at http://127.0.0.1:8124/");