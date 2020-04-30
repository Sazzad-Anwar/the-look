//jshint esversion:10
//This code is for serverside program
//In this program nodejs has been used alongwith the node-package-modules

const flash = require('connect-flash'); // This is connect-flash node package module which will work for the alert of any notification
const session = require('express-session'); //This express-session for the user login
const passport = require('passport'); // This passport npm package is for the login authentication
const express = require('express'); // This npm is for running server
const mongoose  = require('mongoose'); // This npm is for mongodb database connection
require('dotenv').config(); // This dotenv package is for using some confidential values which will not be accessible for all.
const app = express(); // declaring the express server as app
const port = 5000 || process.env.PORT; // declaring the port number for the server

//middleware function
app.use(express.urlencoded({extended:true})); //this middleware function will parse the data from the body part of form

//Mongoose connection (database) // this is the string for mongodb connection
mongoose.connect(process.env.URI,{useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify: false}).then(()=>{
    console.log('Database is connected');
});

//passport config
require('./config/passport')(passport); // this is for passport authentication setup

//express middleware setup for session
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
);

app.use(flash()); // setting up the connect-flash middleware function
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//passport middleware function
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','ejs'); // setting up the templating engine ejs
app.use('/', require('./routes/app')); // declaring the home route

app.listen(port,()=> console.log(`The app is running on ${port}`)); // function for the application listenning port