var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    sessionName: { type: String, default: "" },
    sourceCode: { type: String, default: "" },
    docObj: Object,
    owner: String
});

module.exports = mongoose.model('Session', sessionSchema);