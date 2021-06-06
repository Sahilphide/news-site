const NewsAPI = require('newsapi');
const dotenv = require('dotenv');
dotenv.config();
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
var News = require('./models/news');

categories = ['business','entertainment','general','health','science','sports','technology'];
countries = ['us','in','gb','au','nz','ca'];

default_images = {
    business: "https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Falejandrocremades%2Ffiles%2F2018%2F12%2Fbusiness-3605367_1920-1200x741.jpg",
    entertainment:"https://www.forbesindia.com/media/images/2019/Oct/img_122803_media_and_entertainment.jpg",
    general:"https://spiritanroma.org/wp-content/uploads/2018/01/world-news.jpg",
    health:"https://patientengagementhit.com/images/site/article_headers/_normal/GettyImages-CommunityHealth.jpg",
    science:"https://image.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499326.jpg",
    sports: "https://files.northernbeaches.nsw.gov.au/sites/default/files/styles/gi--main-thumbnail/public/images/general-information/sports-associations/sports-associations.jpg?itok=BGgsVt7w",
    technology:"https://forwardthinkingpt.com/wp-content/uploads/2018/11/Physiofusion-1024x819-2-950x760.jpg"
}

function del(){
    News.deleteMany({},function(err){
        if(err){
            console.log(err);
        }
        console.log('deleted')
    });
}

function add(country){
    categories.forEach(function(c){
        newsapi.v2.topHeadlines({
            category: c,
            language: 'en',
            country: country
        }).then(data=>{
            data.articles.forEach(function(article){
                if(article.title && article.content){
                    obj = {
                        key:{
                            title: article.title,
                            content: article.content,
                        },
                        title: article.title,
                        content: article.content,
                        category: c,
                        image_url: default_images[c]
                    };
                    if(article.source.name){
                        obj.source = article.source.name;
                    }
                    if(article.author){
                        obj.author = article.author;
                    }
                    if(article.description){
                        obj.description = article.description;
                    }
                    if(article.url){
                        obj.article_url=article.url;
                    }
                    if(article.urlToImage){
                        obj.image_url = article.urlToImage;
                    }
                    if(article.publishedAt){
                        var week = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
                        var date = new Date(article.publishedAt);
                        obj.published_at = week[date.getDay()] + ", " + date.getFullYear() + "-" + date.getMonth() + '-' +  date.getDate();
                    } 
                }
                News.create(obj,function(err,article){
                    if(err){
                        // console.log(err);
                    }
                });
            });
        });
    });
}

function addAll(){
    countries.forEach(function(country){
        add(country);
    });
}



module.exports = {del:del,add:addAll}