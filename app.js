let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let expressValidator = require('express-validator');
let session = require('express-session');
let flash = require('connect-flash');
let multer = require('multer');
let upload = multer({ dest: './public/images/portfolio' });

// Route Files
let routes = require('./routes/index');
let admin = require('./routes/admin');

// Init App
let app = express();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.'),
          root = namespace.shift(),
          formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Connect Flash
app.use(flash());

app.use('/', routes);
app.use('/admin', admin);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
	console.log('Server started on port: '+ app.get('port'));
});
