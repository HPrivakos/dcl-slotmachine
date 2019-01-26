import Slot from "./games/Slots";
import cryptoRandomString from "crypto-random-string";

let bank = 0
let player = 0

for (let index = 0; index <= 1e6; index++) {
    bank++; player--;
    let spin = new Slot(cryptoRandomString(16), 0.9);
    let res = spin.result()
    //console.log(spin.getSlotNumbers());
    
    if(res != 0){
        player += res
        bank -= res
    }
    
    if(index%1000 == 0){
        console.log(index);
        console.log("Bank = "+bank);
        console.log("Player = "+player);
        console.log();
        console.log();
        
    }
    
}