//jshint esversion:10

//this route will handle the registration process
const user = require('../model/db');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);

        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        let name = file.originalname.split(".");
        cb(null, Date.now() + "." + name[1]);
    },
});

var upload = multer({
    storage: storage,
});

//this registration module will deliver the register page and this module itself will be exported to the router file
exports.registration = (req, res) => {
    res.render('register');
};

//here the input for the registration will be taken and passed it through the mechanism where a user will be registered and save the data to the database
exports.registrationPost = ((req, res) => {
    // console.log(req.body);
    const {
        name,
        email,
        phone,
        country,
        typeOfPhotographer,
        password,
        password2,
    } = req.body;
    console.log(req.body.name, req.body.email, req.body.phone, req.body.password, req.body.password2);

    if (password !== password2) {
        req.flash({
            msg: "Passwords do not match"
        });
    }
    if (password.length < 6) {
        req.flash({
            msg: "Password must be at least 6 characters"
        });
    } else {
        user.findOne({
            email: email
        }).then(found => {
            if (found) {
                req.flash({
                    msg: "Email already exists"
                });
                res.render('register', {
                    name,
                    email,
                    phone,
                    country,
                    typeOfPhotographer,
                    password,
                    password2
                });
            } else {
                try {
                    const newUser = new user({
                        name,
                        email,
                        phone,
                        country,
                        typeOfPhotographer,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success_msg', "You are now registered and can log in");
                                res.redirect('/login');
                            }).catch(err => res.status(404).send(err));
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }
});

// module.exports = router;