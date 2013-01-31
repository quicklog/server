var authentication = require('./lib/authentication.js')
  , data = require('./lib/data.js')
  , express = require('express')
  , api = require('./routes/api')
  , flash = require('connect-flash')
  , ui = require('./routes/ui')
  , analyse = require('./routes/analyse')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
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

// TODO wire in auth
// ui
app.get('/', ui.index);
app.get('/me', ui.me);
app.get('/me/procedures/all', ui.all);

// api
app.get('/api/1/me/tags', api.getTags);
app.get('/api/1/me/items/:tag/:day', api.getItems);

// analytics
app.get('/api/1/me/analyse/items', analyse.getitems);
app.get('/api/1/me/analyse/items/:tag', analyse.getitemsbytag);

// posts
app.post('/api/1/me/register', api.register);
app.post('/api/1/me/items', api.addItems);

// auth
// TODO put callback in seperate module as above
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err); 
    }

    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/')
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/' + user.username);
    });

  })(req, res, next);
});

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
// TODO tests
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  authentication.findById(id, function (err, user) {
    done(err, user);
  });
});

var theLocalStrategy = function(username, password, done) {
  process.nextTick(function () {
    
    authentication.findByUsername(username, function(err, user) {
      if (err) { 
        return done(err); 
      }

      if (!user) { 
        return done(null, false, { message: 'Unknown user ' + username }); 
      }

      if (user.password != password) { 
        return done(null, false, { message: 'Invalid password' }); 
      }

      return done(null, user);
    })
  });
};

passport.use(new LocalStrategy(theLocalStrategy));
