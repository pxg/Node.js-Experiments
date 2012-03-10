var express = require('express')
  , twitterClient = require('twitter-js')('xkkYU4jl80CVrQHUpumMZA', '5hStE3aP')
  , app = express.createServer(
      express.bodyParser()
    , express.cookieParser()
    , express.session({secret: '72WdDKKNeKeYDspkutJbaqitepE23RQ0H8PbFRCYEKg'})
    );

app.get('/', function (req, res) {
  twitterClient.getAccessToken(req, res, function (error, token) {
    //res.render('client', {token: token});
    console.log('client');
  });
});

app.post('/message', function (req, res) {
  twitterClient.apiCall('POST', '/statuses/update.json',
    {token: {oauth_token_secret: req.param('oauth_token_secret'), oauth_token: req.param('oauth_token')}, status: req.param('message')},
    function (error, result) {
      res.render('done.jade');
      console.log('done');
    }
  );
});

app.listen(3003);