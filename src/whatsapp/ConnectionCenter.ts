import {WhatsSocket} from "./whatsSocket";


export class ConnectionCenter {

    private static socksMap: Map<string, WhatsSocket> = new Map<string, WhatsSocket>();

    static setSocket(socket: WhatsSocket) {
        ConnectionCenter.socksMap.set('connectionUP', socket);
    }
    static getSocket(): WhatsSocket {
        return ConnectionCenter.socksMap.get('connectionUP')!! // SERA QUE EXPLODE A MERDA AQUI?
    }

}
