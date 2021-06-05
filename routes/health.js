var express = require('express'),
    router = express.Router(),
    middleWare = require('../middleware/index'),
    User = require('../models/user'),
    News = require('../models/news');


router.get('/',middleWare.isLoggedIn,function(req,res){
    News.find({category:'health'}).exec(function(err,articles){
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
                res.render('show',{articles:articles.reverse(),title:"GT | Health"});
            });
        }
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