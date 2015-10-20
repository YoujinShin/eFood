
var express = require('express');
var http = require('http');
var path = require('path');


// the ExpressJS App
var app = express();

app.configure(function(){

  // server port number
  app.set('port', process.env.PORT || 5000);

  //  templates directory to 'views'
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  app.set('view engine', 'html');
  // app.set('layout','layout');
  app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // pass a secret to cookieParser() for signed cookies
  app.use(express.cookieParser('SECRET_COOKIE_HASH_HERE'));
  app.use(express.cookieSession()); // add req.session cookie support
  
  // make sesssion information available to all templates
  app.use(function(req, res, next){
    res.locals.sessionUserName = req.session.userName;
    res.locals.sessionUserColor = req.session.userColor;
    next();
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// ROUTES
var routes = require('./routes/index.js');

app.get('/', routes.index);
app.get('/scroll', routes.scroll);


// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

