var twitterConsumerKey = 'xkkYU4jl80CVrQHUpumMZA';
var twitterConsumerSecret = '72WdDKKNeKeYDspkutJbaqitepE23RQ0H8PbFRCYEKg';
var twitterAccessToken = '80850910-Ym8qUoa8Zc0iioeUrM3cs8mKL8CDENNo4DkG0ceal';
var twitterAccessTokenSecret = 'oPangw88JuQmBlZLEKdF0aQx4Zo8fuOqlMD3UhhTUQQ';

var OAuth= require('oauth').OAuth;
oAuth= new OAuth("http://twitter.com/oauth/request_token",
                 "http://twitter.com/oauth/access_token", 
                 twitterConsumerKey,  twitterConsumerSecret, 
                 "1.0A", null, "HMAC-SHA1");       
oAuth.post("http://api.twitter.com/1/statuses/update.json", twitterAccessToken, 
                           twitterAccessTokenSecret, {"status":"Ring the bell cos it's time to eat"}, function(error, data) {
                             if(error) console.log(require('sys').inspect(error))
                             else console.log(data)
});