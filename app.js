
/**
 * Module dependencies.
 */

var express = require('express'),
      api = require('./routes/api.js'),
      ui = require('./routes/ui.js'),
      analyse = require('./routes/analyse.js');

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
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

// routes
app.get('/', ui.index);
app.get('/api/1/me/analyse/items', analyse.getitems)
app.post('/api/1/item', api.addItem);
app.post('/api/1/me/items', api.addItems);
app.get('/api/1/me/items', api.getItems);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
