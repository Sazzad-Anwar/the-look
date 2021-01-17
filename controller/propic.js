//jshint esversion:10
//this part will work for profile picture upload.
// User can upload the profile picture and the picture will be saved in the public folder and the picture name will be saved into database
const multer = require("multer");
const user = require('../model/db');
const fs = require("fs");

var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/profilePic");
    },
    filename: function (req, file, cb) {
      let name = file.originalname.split(".");
      cb(null, Date.now() + "." + name[1]);
    },
  });
  
var upload1 = multer({
  storage: storage1,
});

exports.propic =(upload1.single("profilePic"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  
  
  var ext = req.file.originalname.split('.');
  var mimetype = ext[1];
  console.log(mimetype);
  
  if (mimetype == "jpg" || mimetype == "png") {
    let dateTime = new Date();
    // let options = {
    //   weekday: "long",
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   minute: '2-digit',
    //   hour: '2-digit'
    // };
    // let date = dateTime.toLocaleDateString('en-US', options);
    let path = req.file.path.split("\\");
    let image = path[1] + "/" + path[2];
    
    user.findOne({
      email: req.body.email
    }, (err, found) => {
      if (found) {
          console.log(found);
          user.updateOne({
            "email": req.body.email,
          }, {
            $set: {
              "profile_pic":image
            },
          }, (err, done) => {
            if (done) {
              console.log('Profile picture is uploaded');
              setTimeout((()=>{
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
      res.send("This is not an Image");
    });
  }
});
