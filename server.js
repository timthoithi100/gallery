const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator'); // Keep this line for now, but we'll use it differently
const config = require('./_config');

// Define routes
let index = require('./routes/index');
let image = require('./routes/image');

// connecting the database
mongoose.connect(config.mongoURI.production, { useNewUrlParser: true, useUnifiedTopology: true });

// test if the database has connected successfully
let db = mongoose.connection;
db.once('open', ()=>{
    console.log('Database connected successfully')
})
// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Initializing the app
const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up the public folder;
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
// The old way of directly calling expressValidator() as a function is deprecated/changed.
// For older versions or compatibility, we might need to use it like this or downgrade.
// A common fix for this error is to use the middleware as shown below, assuming an older pattern.
app.use(expressValidator());


app.use('/', index);
app.use('/image', image);


const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>{
    console.log(`Server is listening at http://localhost:${PORT}`)
});