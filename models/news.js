const mongoose = require('mongoose')

const newSchema = mongoose.Schema({

    source: String,
    author : String,
    title :{
        type: String,
        unique:false,
    },
    description : {
        type: String,
        unique: false,

    },
    article_url: String,
    image_url : String,
    publiished_at : String,
    content :{
        type: String,
        unique :false
    },

    category:String
});