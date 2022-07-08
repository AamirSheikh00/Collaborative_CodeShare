var express = require('express')
var router = express.Router()
const Session = require('../models/Session')
const User = require('../models/User')

router.get("/join", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("join", { sessionID: "", displayName: req.user.name })
    }
    else {
        res.render("join", { sessionID: "", displayName: "" })
    }
})

router.get("/", function (req, res) {
    if (req.query["id"]) {
        if (req.query["name"]) {
            Session.findOne({ _id: req.query["id"] }, function (err, data) {
                if (err) {
                    console.log('err')
                    res.render("error")
                }
                else {
                    if (data) {
                        res.render("session", { nameVar: data.sessionName })
                    }
                    else {
                        res.render('error')
                    }
                }
            })
        }
        else
            res.render("join", { sessionID: req.query["id"], displayName: "" })
    }
    else {
        res.render('error')
    }
})

router.post("/newSession", function (req, res) {
    if (req.isAuthenticated()) {
        var newSession = new Session({
            sourceCode: "",
            owner: req.user.username,
            sessionName: req.body.sessionName
        });
        newSession.save(function (err, data) {
            if (err) {
                console.log(err)
                res.render("error")
            }
            else {
                User.findByIdAndUpdate({ _id: req.user._id },
                    { $push: { sessions: data._id } },
                    function (error, success) {
                        if (error) {
                            console.log(error);
                            res.render("error")
                        }
                    })
                res.redirect('/sessions?id=' + data._id + '&name=' + req.user.name)
            }
        })
    } else {
        res.redirect("/");
    }
})

module.exports = router