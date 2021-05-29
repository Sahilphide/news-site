const express = require('express')
const mongoose = require('mongoose')
dotenv = require('dotenv'),


dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/news_website', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify:false,
    useCreateIndex:true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));



