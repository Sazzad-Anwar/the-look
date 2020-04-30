//jshint esversion:10

const user = require('../model/db');

exports.artist_gallery = (req,res)=>{
    const id = req.body.id;

    user.findOne({"email":id},(err,gallery)=>{
        if(err){
            res.send(err);
        }else{
            res.render('artist_gallery',{gallery});
        }
    });
};