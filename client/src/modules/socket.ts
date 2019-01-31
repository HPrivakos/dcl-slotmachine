export class Socket {
    socket: WebSocket;
    constructor(url, slot: Function) {
        this.socket = new WebSocket(url)
        this.socket.onmessage = (event) => {
            log(event)
            if(event.toString().indexOf('Slot ') == 0){
                if (event.toString().split(" ")[1]) slot(event);
            }
        }
        
        this.socket.onerror = (e)=>{
            log("error",e)
        }
        this.socket.onopen = (e)=>{
            log("open",e)
        }
    }
}