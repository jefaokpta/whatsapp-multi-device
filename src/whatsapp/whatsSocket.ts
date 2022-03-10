import makeWASocket from "@adiwajshing/baileys";
import {VersionWaWeb} from "../static/versionWaWeb";
import {AuthState} from "./AuthState";


export class WhatsSocket {
    sock = makeWASocket({
        version: VersionWaWeb.version,
        auth: AuthState.state,
        printQRInTerminal: true
    })
}
