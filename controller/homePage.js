//jshint esversion:10
//this will export the homepage 
const user = require('../model/db');
exports.homePage = (req,res)=>{
    user.find({},(err,found)=>{
        if(err){
            res.send(err);
        }else{
            res.render('index',{found});
        }
    });
};