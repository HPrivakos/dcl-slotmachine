interface User {
    socket: WebSocket,
    ethAddress: string | undefined
}

export default class Users {
    users: User[];
    constructor() {
        this.users = []
    }

    addUser(socket: WebSocket, ethAddress: string | undefined) {
        this.users.push({ socket: socket, ethAddress: ethAddress });
    }

    deleteUser(socket: WebSocket){
        let arr = this.users;
        for (let i = 0; i < arr.length; i++) {
            if(arr[i].socket = socket) this.users = arr.splice(i, 1)
        }
    }
}