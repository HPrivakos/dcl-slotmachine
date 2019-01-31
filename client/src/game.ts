import { Slot_Machine } from "./modules/slot"
import { getProvider } from "@decentraland/web3-provider";
import { getUserAccount } from "@decentraland/EthereumController";
import * as eth from "../node_modules/eth-connect/esm";

let socket = new WebSocket("ws://localhost:8080");

let balance;

const slot = new Slot_Machine(new Vector3(1, 0, 1), socket)
slot.show()
slot.rotate(135)

socket.onopen = async ()=>{
    getUserAccount().then(a => {
        socket.send("login "+a)
    })
}

socket.onmessage = function (event) {
    log("WebSocket message received:", event.data)
    if(event.data.indexOf("balance") == 0){
        balance = event.data.split(' ')[1]
    }
    if(event.data.indexOf("Slot") == 0){
        let data = event.data;
        if (data.indexOf("SlotProva") == 0){
            socket.send("Slot Spin")
        }
        if (data.indexOf("SlotResult") == 0){
            let parsed = JSON.parse(data.slice(11))
            log(parsed)
            slot.setWheels(parsed.numbers)
        }
    }
}

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
