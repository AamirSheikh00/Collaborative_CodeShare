const users = []

function userJoin(id, username, session) {
    const user = { id, username, session }
    users.push(user);
    return user;
}

function getCurrUser(id) {
    return users.find(user => user.id === id)
}

// user leaves chat
function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);
    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}


function getSessionUsers(session) {
    return users.filter(user => user.session === session)
}

module.exports = { userJoin, getCurrUser, userLeaves, getSessionUsers };