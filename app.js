var express = require('express')
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
app.get('/procedures/all', ui.all);
app.get('/procedures/:tag', ui.tagged);

app.get('/api/1/me/analyse/items', analyse.getitems);
app.get('/api/1/me/items', api.getItems);

app.post('/api/1/me/register', api.register);
app.post('/api/1/me/items', api.addItems);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
