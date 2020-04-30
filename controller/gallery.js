//jshint esversion:10
//thi will export the gallery pge
const user = require('../model/db');
exports.gallery = (req,res)=>{
    user.find({},(err,gallery)=>{
        res.render('gallery', {gallery});
    });
};