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
function getTweets(query) {
  
  console.log('getting tweets for ' + query);

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
          console.log('emittin twitter event');
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


// list for event (is this the best way to do this?)
Twitter.EventEmitter.once("tweets", function(tweets){
  console.log(tweets);
});


// looping on the server (never stops while server is running)
setInterval(function(){
  // add function to url encode
  var query = 'justin%20bieber';
  getTweets(query);
  console.log("Interval");
  // run everysecond
}, 1000);