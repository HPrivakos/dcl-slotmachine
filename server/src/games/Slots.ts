import cryptoRandomString from "crypto-random-string";
import * as crypto from "crypto";

interface gameData {
    serverSeed: string,
    serverSeedHash: string,
    clientSeed: string
}

export default class Slot {
    private gameData: gameData;
    private houseEdge: number;
    constructor(clientSeed: string, houseEdge: number) {
        this.gameData = {
            serverSeed: '',
            serverSeedHash: '',
            clientSeed: clientSeed
        }
        this.houseEdge = houseEdge;
        this.generateServerSeed();
    }

    generateServerSeed(): void{
        let seed = cryptoRandomString(32);
        this.gameData.serverSeed = seed;
        this.gameData.serverSeedHash = crypto.createHash('sha512').update(seed).digest('hex').toString();
    }

    public set clientSeed(v : string) {
        this.gameData.clientSeed = v;
    }
    
    public get serverHash() : string {
        return this.gameData.serverSeedHash;
    }
    
    getSlotNumbers(serverSeed: string = this.gameData.serverSeed, clientSeed: string = this.gameData.clientSeed): string {
        let finalHash = crypto.createHash('sha512').update(serverSeed + clientSeed).digest('hex')
        let six = finalHash.slice(0, 6);
        let final = '';
        for (let index = 0; index < 6; index += 2) {
            final += parseInt(six.slice(index,index+2), 16).toString().slice(-1);
        }
        
        return final;
    }

    result(): number {
        let slotNumbers: String, s: String = this.getSlotNumbers();
       
        if (s[0] === s[1] && s[0] === s[2] && s[2] !== null) {            
            switch (s[0]) {
                case '7':
                    return 270*this.houseEdge;
                    break;
                default:
                    return 25*this.houseEdge;
                    break;
            }
        }
        else if (s[0] === s[1] || s[1] === s[2]) {
            switch (s[1]) {
                case '7':
                    return 10*this.houseEdge;
                    break;
                default:
                    return 2*this.houseEdge;
                    break;
            }
        }
        else {
            return 0;
        }
    }
}