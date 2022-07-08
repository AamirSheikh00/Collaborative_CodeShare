// <% - include('partials/header') %>
//     <style type="text/css" media="screen">
//         #editor {
//             position: absolute;
//             top: 0;
//             right: 0;
//             bottom: 0;
//             left: 0;
//         }
//     </style>
//     <!-- < h1 >//Welcome <%= nameVar %>
//     </h1 > -->

//     <div id="editor"></div>


//     <script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.10.1/qs.min.js"
//         integrity="sha512-aTKlYRb1QfU1jlF3k+aS4AqTpnTXci4R79mkdie/bp6Xm51O5O3ESAYhvg6zoicj/PD6VYY0XrYwsWLcvGiKZQ=="
//         crossorigin="anonymous" referrerpolicy="no-referrer"></script>

//     <script src="https://cdn.socket.io/4.3.2/socket.io.min.js"
//         integrity="sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs"
//         crossorigin="anonymous"></script>
//     <script src="https://pagecdn.io/lib/ace/1.4.12/ace.js" type="text/javascript" charset="utf-8"></script>

//     <script src="/js/session.js"> </script>

//     <% - include('partials/footer') %>

// io.on('connection', socket => {
//     socket.on('joinSession', ({ name, id }) => {
//         const user = userJoin(socket.id, name, id)
//         socket.join(user.session)
//         io.to(user.session).emit('sessionusers', {
//             session: user.session,
//             users: getSessionUsers(user.session)
//         })
//     })

//     socket.on('codeChanged', (code) => {
//         const user = getCurrUser(socket.id)
//         io.to(user.session).emit("changedcode", code)
//     })

//     socket.on('disconnect', () => {
//         const user = userLeaves(socket.id)

//         if (user) {
//             // io.to(user.room)
//             //     .emit('message', formatMessage(botName, `${user.username} has left the chat`))

//             io.to(user.session).emit('sessionusers', {
//                 session: user.session,
//                 users: getSessionUsers(user.session)
//             })
//         }

//     })
// })