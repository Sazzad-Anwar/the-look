//jshint esversion:10
const express = require('express'); // initializing the express module
const router = express.Router(); // setting up the router
const home = require('../controller/homePage'); // linking up the home controller
const artists = require('../controller/artists'); // linking up the artist controller
const gallery = require('../controller/gallery'); // linking up the gallery controller
const contact = require('../controller/contact'); // linking up the contact controller
const register = require("../controller/register"); // linking up the register controller
const login = require('../controller/login'); // linking up the login controller
const dashboard = require('../controller/dashboard'); // linking up the dashboard controller
const artist_gallelry = require('../controller/artist_gallery');
const fs = require('fs');

//Multer configuration for profile picture uploading
const multer = require("multer");
const user = require('../model/db');

var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/profilePic");
    },
    filename: function (req, file, cb) {
      let name = file.originalname.split(".");
      cb(null, Date.now() + "." + name[1]);
    },
  });

  var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
      let name = file.originalname.split(".");
      cb(null, Date.now() + "." + name[1]);
    },
  });

  var storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/coverPhoto");
    },
    filename: function (req, file, cb) {
      let name = file.originalname.split(".");
      cb(null, Date.now() + "." + name[1]);
    },
  });

  var upload1 = multer({
    storage: storage1,
  });
  var upload2 = multer({
    storage: storage2,
  });
  var upload3 = multer({
    storage: storage3,
  });


// initializing the authentication middleware
const {
    forwardAuthenticated,
    ensureAuthenticated
} = require('../config/auth'); 

//setting up the static files like images,js,css,icon-fonts files
router.use(express.static(('public')));
router.use(express.urlencoded({
    extended: true
})); //parsing data from body


// settingup the route for the home page home
router
    .route('/')
    .get(home.homePage);


// setting up the route for the gallery page
router
    .route('/gallery')
    .get(gallery.gallery);

//setting up the route for the artists page
router
    .route('/artists')
    .get(artists.artists);

//setting up the route for the contact page
router
    .route('/contact')
    .get(contact.contact);


// setting up the route for registration page
router
    .route('/registration')
    .get(forwardAuthenticated, register.registration)
    .post(forwardAuthenticated,register.registrationPost);

// setting up the route for login page
router
    .route('/login')
    .get(forwardAuthenticated, login.login)
    .post(login.loginPost);

// setting up the route for dashboard page
router
    .route('/dashboard')
    .get(ensureAuthenticated, dashboard.dashboard);

//setting up the route for the individual artist's gallery page
router
  .route('/ArtistGallery')
  .post(artist_gallelry.artist_gallery);

//logout functionality
router
  .route('/logout')
  .post(login.logout);

//user settings edit
//user name editing route
router
  .route('/name')
  .post(dashboard.edit_name);

//user photography type editing route
router
  .route('/photography')
  .post(dashboard.edit_photograpy);

//user name editing route
router
  .route('/email')
  .post(dashboard.edit_email);

//user pohne editing route
router
  .route('/phone')
  .post(dashboard.edit_phone);

//user country editing route
router
  .route('/country')
  .post(dashboard.edit_country);

//delete gallery photo route
router
  .route('/deleteGphoto')
  .post(dashboard.deleteGallerPhoto);

//delete cover photo route
router
  .route('/deleteCphoto')
  .post(dashboard.deleteCoverPhoto);

//delete profile picture
router
  .route('/deleteProPic')
  .post(dashboard.deleteProPic);

//gallery photo caption edit route
router 
  .route('/editGalleryPhoto')
  .post(dashboard.edit_gallery_photo);
  
//profile picture uploading route
router
    .route('/profilePic')
    //uploading profile picture mechanism
    .post(upload1.single("profilePic"), (req, res) => {
      const previous_pic = req.body.pic;
      console.log(previous_pic);
      
        var ext = req.file.originalname.split('.');
        var mimetype = ext[1];

        if (mimetype == "jpg" || mimetype == "png" || mimetype == 'JPG' || mimetype == 'PNG' || mimetype == 'jpeg') {
          let dateTime = new Date();
          let options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            minute: '2-digit',
            hour: '2-digit'
          };
          let date = dateTime.toLocaleDateString('en-US', options);
          let path = req.file.path.split("\\");
          let image = path[1] + "/" + path[2];
          
          user.findOne({
            email: req.body.email
          }, (err, found) => {
            if (found) {
                user.updateOne({
                  "email": req.body.email,
                }, {
                  $set: {
                    "profile_pic":image
                  },
                }, (err, done) => {
                  if (done) {
                    if(previous_pic !== ''){
                      let remove_path = './public/'+previous_pic;
                      fs.unlink(remove_path,(err)=>{
                        if(err) throw err;
                        console.log('Profile picture is uploaded');
                        setTimeout((()=>{
                          req.flash('success_msg',"Profile Picture has uploaded!");
                          res.redirect('/dashboard');
                        }), 3000);
                      });
                    }else{
                      console.log('Profile picture is uploaded');
                        setTimeout((()=>{
                          req.flash('success_msg',"Profile Picture has uploaded!");
                          res.redirect('/dashboard');
                        }), 3000);
                    }
                  } else {
                    res.send(err);
                  }
                });
            }
          });
        } else {
          const path = "./public/profilePic/" + req.file.filename;
          fs.unlink(path, (err) => {
            if (err) throw err;
            setTimeout((()=>{
              req.flash('error_msg',"This is not an image ! Please upload an image");
              res.redirect('/dashboard');
            }), 3000);
          });
        }
      });

router
      .route('/photoCollection')
      .post(upload2.single("gallery"), (req, res) => {
        var ext = req.file.originalname.split('.');
        var mimetype = ext[1];
        console.log(mimetype);
        
        if (mimetype == "jpg" || mimetype == "png" || mimetype == 'JPG' || mimetype == 'PNG' || mimetype == 'jpeg') {
          let dateTime = new Date();
          let options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            minute: '2-digit',
            hour: '2-digit'
          };
          let date = dateTime.toLocaleDateString('en-US', options);
          let path = req.file.path.split("\\");
          let image = path[1] + "/" + path[2];
          let photo_collection = [{
            "caption":req.body.caption,
            "image":image,
            "createdAt": date
          }];
          
          user.findOne({
            email: req.body.email
          }, (err, found) => {
            if (found) {
                console.log(found);
                user.updateOne({
                  "email": req.body.email,
                }, {
                  $push: {
                    photo_collection
                  }
                }, (err, done) => {
                  if (done) {
                    console.log('Gallery picture is uploaded');
                    setTimeout((()=>{
                      req.flash('success_msg',"Gallery Picture has uploaded!");
                      res.redirect('/dashboard');
                    }), 3000);
                  } else {
                    res.send(err);
                  }
                });
            }
          });
        } else {
          const path = "./public/profilePic/" + req.file.filename;
          fs.unlink(path, (err) => {
            if (err) throw err;
            setTimeout((()=>{
              req.flash('error_msg',"This is not an image ! Please upload an image");
              res.redirect('/dashboard');
            }), 3000);
          });
        }
      });

router
      .route('/coverPic')
      .post(upload3.single("coverPic"), (req, res) => {
        var ext = req.file.originalname.split('.');
        var mimetype = ext[1];
        
        if (mimetype == "jpg" || mimetype == "png" ||  mimetype == 'JPG' || mimetype == 'PNG' || mimetype == 'jpeg') {
          let dateTime = new Date();
          let options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            minute: '2-digit',
            hour: '2-digit'
          };
          let date = dateTime.toLocaleDateString('en-US', options);
          let path = req.file.path.split("\\");
          let image = path[1] + "/" + path[2];
          let cover_pic = [{
            "caption":req.body.caption,
            "image":image,
            "createdAt": date
          }];
          
          user.findOne({
            email: req.body.email
          }, (err, found) => {
            if (found) {
                console.log(found);
                user.updateOne({
                  "email": req.body.email,
                }, {
                  $push: {
                    cover_pic
                  }
                }, (err, done) => {
                  if (done) {
                    console.log('Cover picture is uploaded');
                    setTimeout((()=>{
                      req.flash('success_msg',"Cover Picture has uploaded!");
                      res.redirect('/dashboard');
                    }), 3000);
                  } else {
                    res.send(err);
                  }
                });
            }
          });
        } else {
          const path = "./public/profilePic/" + req.file.filename;
          fs.unlink(path, (err) => {
            if (err) throw err;
            setTimeout((()=>{
              req.flash('error_msg',"This is not an image ! Please upload an image");
              res.redirect('/dashboard');
            }), 3000);
          });
        }
      });


module.exports = router;