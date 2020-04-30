//jshint esversion:10
//this will export the dashboard page
const user = require('../model/db');
const fs = require('fs');

exports.dashboard = (req, res) => {
    res.render('dashboard', {user: req.user});
};

exports.edit_name = (req,res)=>{    
    user.findOneAndUpdate({_id:req.user.id},{$set:{'name':req.body.name}},(err,done)=>{
        if(err){
            res.send(err);
        }else{
            setTimeout((()=>{
                req.flash('success_msg',"Name has been changed");
                res.redirect('/dashboard');
              }), 3000);
        }
    });
};
exports.edit_photograpy = (req,res)=>{
    user.findOneAndUpdate({_id:req.user.id},{$set:{'typeOfPhotographer':req.body.typeOfPhotographer}},(err,done)=>{
        if(err){
            res.send(err);
        }else{
            setTimeout((()=>{
                req.flash('success_msg',"Photography type has been changed");
                res.redirect('/dashboard');
              }), 3000);
        }
    });
};
exports.edit_email = (req,res)=>{
    user.findOneAndUpdate({_id:req.user.id},{$set:{'email':req.body.email}},(err,done)=>{
        if(err){
            res.send(err);
        }else{
            setTimeout((()=>{
                req.flash('success_msg',"Email has been changed");
                res.redirect('/dashboard');
              }), 3000);
        }
    });
};
exports.edit_phone = (req,res)=>{
    user.findOneAndUpdate({_id:req.user.id},{$set:{'phone':req.body.phone}},(err,done)=>{
        if(err){
            res.send(err);
        }else{
            setTimeout((()=>{
                req.flash('success_msg',"Phone number has been changed");
                res.redirect('/dashboard');
              }), 3000);
        }
    });
};
exports.edit_country = (req,res)=>{
    user.findOneAndUpdate({_id:req.user.id},{$set:{'country':req.body.country}},(err,done)=>{
        if(err){
            res.send(err);
        }else{
            setTimeout((()=>{
                req.flash('success_msg',"Country name has been changed");
                res.redirect('/dashboard');
              }), 3000);
        }
    });
};

exports.edit_gallery_photo = (req,res)=>{
    const {caption,id,pic,count}=req.body;
    console.log(id,pic,count);
    
    user.updateOne({"photo_collection._id":pic},{'photo_collection.0.caption':caption},(err,done)=>{
        if(err) throw err;
        if(done){
            console.log(done);
            
            setTimeout((()=>{
                req.flash('success_msg',"Gallery Photo Caption has been Changed!");
                res.redirect('/dashboard');
              }), 3000);
        }
    });
    // user.findOne({_id:id},(err,found)=>{
    //     console.log(found.photo_collection[0].caption);
        
    // });
    
};

exports.deleteGallerPhoto=(req, res) => {
    const user_id = req.body.id;
    const photo_id = req.body.pic_id;
    const fileName = req.body.fileName;
    const path = "./public/" + fileName;
  
    user.updateOne({_id:user_id},{$pull:{photo_collection:{_id:photo_id}}},{multi:true}, (err, deleted) => {
      if (err) throw err;
      fs.unlink(path, (err) => {
        if (err) throw err;
        setTimeout((()=>{
            req.flash('success_msg',"Gallery Photo has been deleted!");
            res.redirect('/dashboard');
          }), 3000);
      });
      console.log('found',deleted);
    });
  };

  exports.deleteCoverPhoto=(req, res) => {
    const user_id = req.body.id;
    const photo_id = req.body.pic_id;
    const fileName = req.body.fileName;
    const path = "./public/" + fileName;
  
    user.updateOne({_id:user_id},{$pull:{cover_pic:{_id:photo_id}}},{multi:true}, (err, deleted) => {
      if (err) throw err;
      fs.unlink(path, (err) => {
        if (err) throw err;
        setTimeout((()=>{
            req.flash('success_msg',"Cover Photo has been deleted!");
            res.redirect('/dashboard');
          }), 3000);
      });
      console.log('found',deleted);
    });
  };

  exports.deleteProPic=(req, res) => {
    const user_id = req.body.id;
    const fileName = req.body.fileName;
    const path = "./public/" + fileName;
  
    user.updateOne({_id:user_id},{$set:{profile_pic:null}},{multi:true}, (err, deleted) => {
      if (err) throw err;
      fs.unlink(path, (err) => {
        if (err) throw err;
        setTimeout((()=>{
            req.flash('success_msg',"Profile Photo has been deleted!");
            res.redirect('/dashboard');
          }), 3000);
      });
      console.log('found',deleted);
    });
  };