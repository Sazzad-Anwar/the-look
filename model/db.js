//jshint esversion:10

// This is the database schema model for user's name,email,phone,profile_picture,country,photo_collection,password
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    profile_pic:{
        type:String,
        default: null
    },
    country:{
        type:String,
        required:true
    },
    typeOfPhotographer:{
        type:String,
        required:true
    },
    cover_pic:[{
        createdAt:{
            type:String,
            required: true
        },
        image:{
            type:String,
            required:true
        },
        caption:{
            type:String,
            required:true
        }
    }],
    photo_collection:[{
        createdAt:{
            type:String,
            required: true
        },
        image:{
            type:String,
            required:true
        },
        caption:{
            type:String,
            required:true
        }
    }],
    password:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Artist',artistSchema);