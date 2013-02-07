var auth = require('./lib/authentication.js')
  , data = require('./lib/data.js')
  , express = require('express')
  , api = require('./routes/api')
  , flash = require('connect-flash')
  , ui = require('./routes/ui')
  , analyse = require('./routes/analyse')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , users = require('./lib/users.js')
  , LocalStrategy = require('passport-local').Strategy;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'industry under realize band' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// ui
app.get('/', ui.index);
app.get('/me', auth.ensure, ui.me);

// api
app.get('/api/1/me/tags', auth.ensure, api.getTags);
app.get('/api/1/me/items/:tag/:day', api.getItems);

// analytics
app.get('/api/1/me/analyse/items', auth.ensure, analyse.getitems);
app.get('/api/1/me/analyse/items/:tag', auth.ensure, analyse.getitemsbytag);

// posts
app.post('/api/1/me/device/authenticate', api.authenticate);
app.post('/api/1/me/items', api.addItems);

// auth
app.post('/login',
  passport.authenticate('local', { successRedirect: '/me',
                                   failureRedirect: '/',
                                   failureFlash: true })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


console.log('opening database ' + data.configuration().database + ' on ' + data.configuration().host);
data.open(function(e) {
  console.log('database opened');
  if(e) {
    console.error(e);
    return;
  }

  console.log('starting server');
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});

// authentication
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  users.byEmail(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  users.byEmailAndPassword(username, password, done);
}));