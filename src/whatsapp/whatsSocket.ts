import makeWASocket, {useSingleFileAuthState} from "@adiwajshing/baileys";
import {authFileRestore} from "../util/authHandler";
import {VersionWaWeb} from "../static/versionWaWeb";

const { state, saveState } = useSingleFileAuthState(authFileRestore())

export class WhatsSocket {
    static sock = makeWASocket({
        version: VersionWaWeb.version,
        auth: state,
        printQRInTerminal: true
    })
}
