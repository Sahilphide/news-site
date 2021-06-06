const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const  seedDB = require('./seeds')
const  LocalStrategy = require('passport-local')
const  User = require('./models/user')
const methodOverride = require('method-override')
const  flash = require('connect-flash')
const  dotenv = require('dotenv')
const  cron = require('cron')
const  app = express();
dotenv = require('dotenv'),


dotenv.config();

var businessRoutes = require('./routes/business'),
    sportsRoutes = require('./routes/sports'),
    techRoutes = require('./routes/technology'),
    healthRoutes = require('./routes/health'),
    userRoutes = require('./routes/user'),
    indexRoutes = require('./routes/index');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/news_website', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify:false,
    useCreateIndex:true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


var job = new cron.CronJob('* */6 * * *',()=>{
    seedDB.add();
});
job.start();

// seedDB.add();

app.set('view engine','ejs');
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());

app.use(require('express-session')({
    secret:"News Website",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next(); 
});

app.use('/business',businessRoutes);
app.use('/sports',sportsRoutes);
app.use('/technology',techRoutes);
app.use('/health',healthRoutes);
app.use('/',indexRoutes);
app.use('/',userRoutes);

app.listen(process.env.PORT,function(){
    
});





