const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    contact: String,
    password: String,
    favourites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "News", // for getting all user fav list from db
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);