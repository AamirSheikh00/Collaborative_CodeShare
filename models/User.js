const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');
const { ObjectId } = mongoose.Schema.Types
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: String,
    sessions: [{
        type: ObjectId,
        ref: "Session"
    }]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);