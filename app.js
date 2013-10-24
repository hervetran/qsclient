/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , fs = require('fs');

var app = express();
var path = __dirname;

function bootApplication(app) {
  app.configure(function(){
    app.set('port', process.env.PORT || 3001);
    app.set('views', path + '/views');
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path + '/public'));
  });
}

function bootRoutes(app) {
  require(path + '/routes/main')(app);
}
// Import configuration
require(path + '/config/index.js')(app, express);

// Bootstrap application
bootApplication(app);
bootRoutes(app);

app.configure('development', function(){
  app.use(express.errorHandler())
});

// Launch server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server : Listening on port ' + app.get('port'));
  console.log('\x1B[32mQuantified-self CLIENT ready to go !\x1B[0m');
});
