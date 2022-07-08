require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
var ot = require('ot');
// const { userJoin, getCurrUser, userLeaves, getSessionUsers } = require("./utils/users")

//---------------------------------------------------------------

mongoose.connect("mongodb://localhost:27017/database", { useNewUrlParser: true });

const User = require('./models/User')
const Session = require('./models/Session')

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//---------------------------------------------------------------

const app = express();
const server = http.createServer(app);
const io = socketIO(server)

app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "a8FRCWFjhd",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//---------------------------------------------------------------

const homes = require("./routes/homeRoutes")
const sessions = require("./routes/sessions")

app.use("/", homes)
app.use("/sessions", sessions)

//---------------------------------------------------------------

var sessionList = {};

io.on('connection', function (socket) {

    socket.on('joinSession', async (data) => {

        if (!sessionList[data.session]) {
            // Backup remaining
            var str = "";
            const savedSession = await Session.findById(data.session);
            str += savedSession.sourceCode
            if (!str) {
                str =
                    '// Welcome User';
            }
            var socketIOServer = new ot.EditorSocketIOServer(str, [], data.session, (socket, cb) => {
                var self = this;
                Session.findByIdAndUpdate({ _id: data.session }, { $set: { docObj: self.document } }, function (err, file) {
                    if (err)
                        return cb(false);
                    cb(true);
                });
            });
            sessionList[data.session] = socketIOServer;

        }

        sessionList[data.session].addClient(socket);

        sessionList[data.session].setName(socket, data.username);

        socket.room = data.session;
        socket.join(data.session);
        io.to(socket.room).emit('chatMessage', { message: data.username + " has joined the chat", username: ">" })

        Session.find()
    });

    socket.on('chatMessage', function (data) {
        io.to(socket.room).emit('chatMessage', data);
    });

    socket.on("saveCode", function (data) {
        console.log(data)
        Session.findByIdAndUpdate({ _id: data.session }, { $set: { sourceCode: data.code } }, function (err, file) {
            if (err)
                console.log(err)
        });
    })

    socket.on('disconnect', function () {
        io.to(socket.room).emit('chatMessage', { message: "A has left the chat", username: ">" })
        socket.leave(socket.room);
    });
})

//---------------------------------------------------------------

server.listen(3000, function () {
    console.log("Server started on port 3000.");
});
