
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var webshot = require('webshot');

var RedisStore = require("connect-redis")(express)
var sessionStore = new RedisStore({host:"localhost", prefix:"fetish-list:session:"})
var app = express();

if ('development' != app.get('env')) {
  var redis = require("redis"),
      client = redis.createClient();
  var activeUser = function(req, res, next) {
    client.zadd("fetish-list:active:uniques", (new Date).getTime(), req.ip)
    next()
  }
  app.use(activeUser);
}





// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.enable("trust proxy");
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('gSflBU7Em4YOGINNSPgy'));
app.use(express.session({
  secret: "JRrQK6lIZvZXCqhIvCcg",
  store: sessionStore
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var loadPng = function(req, res) {
  res.type('png');
  var options = {
    windowSize:{
      width:1300,
      height:768
    },
    shotSize:{
      width:"window",
      height:"all"
    }
  }
  webshot("http://localhost:"+app.get("port")+"/?png=1#"+req.params.tag, options, function(err, renderStream) {
    renderStream.on("data", function(data) {
      res.write(data.toString("binary"), "binary")
    });
    renderStream.on("end", function() {
      res.end()
    })
  });
}
app.get('/:tag.png', loadPng);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
