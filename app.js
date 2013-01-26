var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , ui = require('./routes/ui')
  , analyse = require('./routes/analyse')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', ui.index);
app.get('/api/1/me/analyse/items', analyse.getitems)
//app.post('/api/1/item', api.addItem);
app.post('/api/1/me/items', api.addItems);
app.get('/api/1/me/items', api.getItems);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});