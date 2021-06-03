// middle to cheak weather user is logged in or not before he perform any operation
function isLoggedIn(req, res ,next){
    if(req.isAuthenticated()){
        return next(); // it is a middle ware
    }

    req.flash("error", "please log in first");
    req.redirect("/login"); // send back to login page
}

// cheaking for log out
function isLoggedOut(req,res,next){
    if(req.isAuthenticated()== false){
        next(); // u are successfully logged out
    }

    //else
    req.flash("success", "you are logged in");
    req.redirect('/');
}

module.export = {
    isLoggedIn : isLoggedIn,
    isLoggedOut : isLoggedOut
}