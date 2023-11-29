// Create web server application

// Import Express module
const express = require('express');
const app = express();

// Import body-parser module
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Import Express-Handlebars module
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Import Mongoose module
const mongoose = require('mongoose');

// Connect to Mongoose database
mongoose.connect('mongodb://localhost/rotten-potatoes', { useNewUrlParser: true });

// Import Comment model
const Comment = require('./models/comment');

// Import Review model
const Review = require('./models/review');

// Import Movie model
const Movie = require('./models/movie');

// Import method-override module
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Import express-session module
const session = require('express-session');

// Import connect-flash module
const flash = require('connect-flash');
app.use(flash());

// Import passport module
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

// Import User model
const User = require('./models/user');

// Configure express-session
app.use(session({
    secret: 'super secret',
    resave: false,
    saveUninitialized: true
}));

// Configure passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set global variables
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error'); // Display error messages
    res.locals.success = req.flash('success'); // Display success messages
    next();
});

// Import routes
const commentRoutes = require('./routes/comments');
const reviewRoutes = require('./routes/reviews');
const movieRoutes = require('./routes/movies');
const indexRoutes = require('./routes/index');

// Use routes
app.use(commentRoutes);
app.use(reviewRoutes);
app.use(movieRoutes);
app.use(indexRoutes);

// Set port
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
