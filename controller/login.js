//jshint esversion:10

// this will export the login and dashboard page

const user = require('../model/db');
const bcrypt = require('bcryptjs');
const passpost = require('passport');

exports.login = (req, res) => {
    res.render('register');
};

//in this login post the user email and password will be taken and get it through the authentication
exports.loginPost = (req, res, next) => {
    // console.log(req.body.email,req.body.password);
    passpost.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/registration',
        failureFlash: true
    })(req, res, next);
};

// this will export the logout route where pressing on a button this functionality will be functinal and a user can log out
exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', "Logged Out!!");
    res.redirect("/login");
};

