const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const config = require('./_config');

// Define routes
let index = require('./routes/index');
let image = require('./routes/image');

// Initializing the app
const app = express();

// connecting the database
mongoose.connect(config.mongoURI.production, { useNewUrlParser: true, useUnifiedTopology: true }); // Make sure to use the correct URI for your environment

// test if the database has connected successfully
let db = mongoose.connection;
db.once('open', ()=>{
    console.log('Database connected successfully')
})
// Check for DB errors
db.on('error', function(err){
  console.log(err);
});


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
app.use(expressValidator());

app.get('/health', (req, res) => {
    // Check MongoDB connection status for a more robust health check
    if (mongoose.connection.readyState === 1) { // 1 means connected
        res.status(200).send('OK - Database Connected');
    } else {
        res.status(500).send('Error - Database Not Connected');
    }
});

app.use('/', index);
app.use('/image', image);


// Export the app instance for testing
module.exports = app;

// Only start the server if this file is run directly (not imported by 'require')
if (require.main === module) {
    const PORT = process.env.PORT || 10000;
    app.listen(PORT,() =>{
        console.log(`Server is listening at http://localhost:${PORT}`)
    });
}