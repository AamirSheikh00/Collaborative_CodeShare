const { id, name } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
var colorScheme = 1


document.getElementById("session").innerText = window.location.host + "/sessions?id=" + id
document.getElementById("user-name").innerText = name

var EditorClient = ot.EditorClient;
var SocketIOAdapter = ot.SocketIOAdapter;
var CodeMirrorAdapter = ot.CodeMirrorAdapter;

var socket = io.connect('http://localhost:3000');
var codeEditor = CodeMirror.fromTextArea(document.getElementById('codeeditor'), {
    lineNumbers: true,
    matchBrackets: true,
    mode: "javascript"
});

var sourceCode = document.getElementById("codeeditor").innerText;
var cmClient;
var chatIp = document.getElementById("user-send")

document.getElementById("save").addEventListener("click", () => {
    var text = codeEditor.getValue()
    socket.emit("saveCode", { session: id, code: text })
})

document.getElementById("download").addEventListener("click", () => {
    var text = codeEditor.getValue()

    var fileBlob = new Blob([text], { type: "application/octet-binary" });

    var link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(fileBlob));
    link.setAttribute("download", "code.js");
    link.click()
})

function init(str, revision, clients, serverAdapter) {
    if (!sourceCode) {
        codeEditor.setValue(str);
    }
    cmClient = window.cmClient = new EditorClient(
        revision, clients, serverAdapter, new CodeMirrorAdapter(codeEditor)
    );
};

var userMessage = function (name, text) {
    return ('<li class="media"><div class="media-body"><div class="media">' +
        '<div class="media-body">' +
        '<b>' + name + '</b> : ' + text +
        '<hr/> </div></div></div></li>'
    );
};

var sendMessage = function () {
    var userMessage = chatIp.value;
    socket.emit('chatMessage', { message: userMessage, username: name });
    document.getElementById("user-send").value = "";
};

socket.on('doc', function (obj) {
    init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
});

socket.on('chatMessage', function (obj) {
    var chat = document.getElementById("user-messages")
    chat.innerHTML += userMessage(obj.username, obj.message)
    chat.lastChild.scrollIntoView()
})

socket.emit('joinSession', { session: id, username: name });