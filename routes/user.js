const express = require('express')
const passport = require('passport')
const User = require("../models/user.js")
const router = express.Router()
const middleWare = require("../middleware/index.js")


router.get('/profile',middleWare.isLoggedIn,function(req,res){
    User.findById(req.user._id).populate('favourites').exec(function(err,user){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            var articles = user.favourites;
            articles.forEach(function(article){
                article.isFav = true;
            })
            res.render('profile',{user:user,articles:articles.reverse(),title:"news"}); // reverse - for getting most recent fav on top
        }
    });
});

//edit
router.get("/edit", middleWare.isLoggedIn,(req,res)=>{
    User.findById(req.user._id ,function(req,res){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.render('edit',{user :user});
        }
    });
});

// add changes and redirect user to its profile page
router.put('/edit',middleWare.isLoggedIn ,(req,res)=>{
    User.findById(req.user._id , function(req,res){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            //taking all input and update db

            user.username = req.body.username;
            user.email = req.body.email;
            user.contact = req.body.contact;
            user.save();
            console.log(user);
            res.redirect('/profile');
        }
    });
});

// adding user fav in db from db

router.post("/add/:id", middleWare.isLoggedIn , function(req,res){
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            user.favourites.push(req.params.id);
            user.save(); // update the fav
            res.json({sucess : true});
        }
    });
});

// deleting from fev

router.delete("delete/:id" , middleWare.isLoggedIn, (req,res)=>{
    User.findById(req.user._id , function(err,user){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            user.favourites.splice(user.favourites.indexOf(req.param.id),1);
            user.save();
            res.json({ success : true});
        }

    });
});

// authorisation

router.get('/register' , middleWare.isLoggedOut,function(req,res){
    res.render("register");
});

router.post('register', middleWare.isLoggedOut , function(req,res){
    User.register(new User({
        username : req.body.username,
        email: req.body.email,
        contact: req.body.contact
    }),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.render('register');
        }else{
            passport.authenticate('local')(req,res,function(){
                req.flash('success', 'welcome' +user.username);
                res.redirect("/");
            });
        }
    });
});

router.get('/login', middleWare.isLoggedOut,function(req,res){
    res.render('login');
});

router.post('/login', passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
}));

router.get('/logout' , function(req,res){
    req.logout();
    req.flash('success', 'successfully logged out');
    res.redirect('/');
});

module.export = router;