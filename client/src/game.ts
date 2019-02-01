let socketUrl = "ws://hprivakos.net:8080";
import { Slot_Machine } from "./modules/slot"
import { getProvider } from "@decentraland/web3-provider";
import { getUserAccount } from "@decentraland/EthereumController";
import * as eth from "../node_modules/eth-connect/esm";
import { playSound } from "@decentraland/SoundController";

let randomString = (len):string => {
    var text = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += chars.charAt(Math.floor(Math.random() * chars.length));

    return text;
}

const text = new Entity();
text.add(
    new Transform({
        position: new Vector3(1.2 - 0.05, 1.5, 3 - 0.05),
        scale: new Vector3(2.5, 2.5, 0.1)
    })
    );
    
    engine.addEntity(text);
    let gameVar = {
        balance: null,
        clientSeed: randomString(16),
        nextClientSeed: null,
        serverSeedHash: null,
        nextServerSeedHash: null,
        serverSeed: null,
        result: null,
    };
    
    let updateText = ()=>{
        let msg = `Balance: ${gameVar.balance}\nClient seed: ${gameVar.clientSeed}\n`;
        if (gameVar.serverSeedHash) msg += `Server hash:\n${gameVar.serverSeedHash.slice(0, 32)}\n${gameVar.serverSeedHash.slice(32)}\n`;
        if (gameVar.serverSeedHash && gameVar.serverSeed) msg += `Server seed:\n${gameVar.serverSeed}\n\n\n`;
        if(gameVar.serverSeedHash && gameVar.result != 0) msg += `Won: ${gameVar.result} token`;
        else if(gameVar.serverSeedHash && gameVar.result == 0) msg += `Won nothing`;
        if (gameVar.nextClientSeed !== null) msg += `\n\nNext client seed: ${gameVar.nextClientSeed}`
        if (gameVar.nextServerSeedHash !== null) msg += `\nNext server hash (32):\n${gameVar.nextServerSeedHash.slice(0,32)}`
        let textMsg = new TextShape(msg);
        textMsg.fontSize = 20;
        text.set(textMsg);
    }

let socket = new WebSocket(socketUrl);


class reconnectSocket implements ISystem {
    frames: number;
    constructor() {
        this.frames = 0;
    }
    update(dt: number) {
        this.frames++;
        if(socket.CLOSED && this.frames > 20*30){
            this.frames = 0
            socket = new WebSocket(socketUrl);
        }
    }
}





const slot = new Slot_Machine(new Vector3(1, 0, 1), socket)
slot.show()
slot.rotate(135)

socket.onopen = async ()=>{
    engine.removeSystem(new reconnectSocket());
    getUserAccount().then(a => {
        socket.send("login "+a)
    })
}

socket.onclose = ()=>{
    engine.addSystem(new reconnectSocket());
}

socket.onmessage = function (event) {
    log("WebSocket message received:", event.data.split(" ")[0]);
    if(event.data.indexOf("balance") == 0){
        gameVar.balance = event.data.split(' ')[1].toString()
        log(gameVar.balance)
    }
    if(event.data.indexOf("Slot") == 0){
        let data = event.data;
        if (data.indexOf("SlotProva ") == 0){
            if (gameVar.nextClientSeed !== null) gameVar.clientSeed = gameVar.nextClientSeed;
            gameVar.nextClientSeed = randomString(16);

            gameVar.serverSeedHash = data.slice(10)
            socket.send("SlotSpin "+gameVar.clientSeed)
        }
        if (data.indexOf("SlotResult") == 0){
            let parsed = JSON.parse(data.slice(11))
            log(gameVar.serverSeedHash)
            log(parsed.serverSeed)
            log(gameVar.clientSeed)
            log(parsed.numbers)
            gameVar.serverSeed = parsed.serverSeed
            gameVar.result = parsed.result
            gameVar.nextServerSeedHash = parsed.nextSSH
            if (gameVar.result >= 25){
                playSound("sounds/jackpot.mp3", {
                    volume: 100
                })
            }
            slot.setWheels(parsed.numbers)
        }
    }
    updateText()
}

let collideBox = new BoxShape();
collideBox.withCollisions = true;

// Define fixed walls
const board = new Entity();
board.add(
    new Transform({
        position: new Vector3(1.2, 1.5, 3),
        scale: new Vector3(3, 3, 0.1)
    })
);



board.add(collideBox);
engine.addEntity(board);


board.get(Transform).rotation.eulerAngles = new Vector3(0,45,0);
text.get(Transform).rotation.eulerAngles = new Vector3(0,45,0);

// Colors def
let red = Color3.Red()
let green = Color3.Green()
let blue = Color3.Blue()
let black = Color3.Black()
let white = Color3.White()
let purple = Color3.Purple()
let magenta = Color3.Magenta()
let yellow = Color3.Yellow()
let gray = Color3.Gray()
let teal = Color3.Teal()


class loop implements ISystem {
    update(dt: number) {
        if (slot.newClientSeed == true){
            slot.newClientSeed = false;
            if (gameVar.nextClientSeed == null) gameVar.clientSeed = randomString(16);
            else {gameVar.nextClientSeed = randomString(16);}
            updateText();
        }
    }
}
engine.addSystem(new loop());