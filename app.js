
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var exphbs  = require('express-handlebars');

// Routes
var home = require('./routes/home');
var setup = require('./routes/setup');
var go = require('./routes/go');
var bookmarks = require('./routes/bookmarks');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');

var app = express();

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.view);
app.get('/setup', setup.view);
app.get('/setupAlt', setup.viewAlt); // For A/B testing
app.get('/go', go.view);
app.get('/bookmarks', bookmarks.view);
app.post('/save-bookmark', bookmarks.save);
app.post('/delete-bookmark', bookmarks.delete);
app.get('/login', login.view);
app.get('/login/:id', login.fb);
app.get('/logout', logout.logout);
app.get('/verify-login', login.verify);
app.get('/signup', signup.view);
app.get('/verify-signup', signup.verify);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
