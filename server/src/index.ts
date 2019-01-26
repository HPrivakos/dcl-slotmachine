import Loki from 'lokijs';
import * as WebSocket from 'ws';
import Slot from './games/Slots';

let test = new Slot("yoloooo", 0.95);
console.log(test.result());

var db = new Loki('casino.db', {
    autoload: true,
    autosave: true,
    autosaveInterval: 4000
});

let users = db.getCollection("casino");
if (users === null) {
    users = db.addCollection("casino", { indices: ['eth', 'balance'] });
}


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws: any) {
    ws.on("message", function incoming(message: any) {
        if (message.startsWith("login ")) {
            let result = users.where(obj => { return obj.eth == message.split(" ")[1] });
            if(result.length == 0) {
                users.insert({ eth: message.split(" ")[1], balance: 1000 });
            }
            message.reply("balance "+result[0].balance)
        }
        if (message == "slotProvably") {
        }
    });

    ws.send('something');
});

let message: string = "login 0x521B0fEf9CDCf250aBaF8e7BC798CBE13fa98692"

let result = users.where(obj => { return obj.eth == message.split(" ")[1] });
if (result.length == 0) {
    let test = users.insert({ eth: message.split(" ")[1], balance: 1000 });  
}
result = users.where(obj => { return obj.eth == message.split(" ")[1] });

console.log(result);
