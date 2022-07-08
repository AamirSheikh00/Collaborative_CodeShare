var express = require('express')
var router = express.Router()
const Session = require('../models/Session')
const User = require('../models/User')
const passport = require("passport");

const link = "http://localhost:3000/sessions"

router.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/home")
    }
    else { res.render("index") }
});

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
})

router.get("/home", async function (req, res) {
    if (req.isAuthenticated()) {
        var owned = []
        var sess;
        for (var i = 0; i < req.user.sessions.length; i++) {
            sess = await Session.findById(req.user.sessions[i])
            owned.push({ id: sess._id, name: sess.sessionName })
        }
        res.render("home", { nameVar: req.user.name, owned: owned, link: link, user: req.user.name });
    } else {
        res.redirect("/");
    }
})

router.post("/register", function (req, res) {
    User.register({ username: req.body.username, name: req.body.name }, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            res.redirect("/")
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/home");
            });
        }
    });
});

router.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/home");
            });
        }
    });

});

module.exports = router
