const weather = require('openweather-apis'),
const News = require('../models/news'),
const User = require('../models/user'),
const express = require('express'),   request = require('request'),
const middleWare = require('../middleware/index'),
const router = express.Router();

weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID(process.env.WEATHER_API_KEY);

router.get('/',function(req,res){
    res.render('landing');
})

router.get('/latest',middleWare.isLoggedIn,function(req,res){
    request("https://ipinfo.io?token=" + process.env.IP_TOKEN,function(err,response,body){
        var data = JSON.parse(body);
        weather.setCity(data.city);
        weather.getAllWeather(function(err, data){
            obj = {};
            obj.main = data.main;
            obj.description = data.weather[0].description;
            News.find({}).exec(function(err,articles){
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    User.findById(req.user._id,function(err,user){
                        if(err){
                            console.log(err);
                            res.redirect('back');
                        }
                        articles.forEach(function(article){
                            article.isFav = false;
                            user.favourites.forEach(function(post){
                                if(article._id.equals(post._id)){
                                    article.isFav = true;
                                }
                            });
                        });
                        shuffle(articles);
                        res.render('latest',{weather:obj, articles:articles.slice(1,16),header:articles[0],title:"GT | Latest"});
                    });
                }
            });
        });
    });
});

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

module.exports = router;