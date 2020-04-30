//jshint esversion:10
//this will export the artist route
const user = require('../model/db');
exports.artists = (req,res)=>{
    user.find({},(err,artists)=>{
        res.render('artists',{artists});
    });
};