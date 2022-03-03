import makeWASocket, {DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState} from "@adiwajshing/baileys";
import {Boom} from "@hapi/boom";
import {authFileDuplicate, authFileRestore} from "../util/authHandler";


const { state, saveState } = useSingleFileAuthState(authFileRestore())

export async function connectToWhatsApp() {
    const {version, isLatest} = await fetchLatestBaileysVersion()
    console.log(`USANDO WHATS WEB  VERSAO ${version.join('.')}, isLatest: ${isLatest}`)

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true
    })

    /** connection state has been updated -- WS closed, opened, connecting etc. */
    sock.ev.on('connection.update', (update) => {
        const {connection, lastDisconnect, qr} = update
        console.log('QRCODE AQUI', qr)
        console.log('ESTADO DA CONEXAO ', connection)
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('CONEXAO FECHADA POR ', lastDisconnect?.error, 'DATA-HORA ', lastDisconnect?.date, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                console.log('RECONECTANDO...')
                setTimeout(() => {
                    connectToWhatsApp()
                }, 60000)
            }
        } else if (connection === 'open') {
            console.log('conexao aberta')
        }
    })

    sock.ev.on('messages.upsert',  m => {
        console.log(JSON.stringify(m, undefined, 2))
        const message  = m.messages[0]
        // if(!message.key.fromMe){
        //     console.log('respondendo para ', m.messages[0].key.remoteJid)
        //     sock.sendMessage(m.messages[0].key.remoteJid!, {text: 'Faaala José!'})
        // }
    })

    /** ATUALIZA ARQUIVO AUTHS */
    sock.ev.on('creds.update',  () => {
        console.log('ATUALIZANDO CREDS')
        saveState()
        authFileDuplicate()
    })

    // ATUALIZACAO DE STATUS DA MSG
    sock.ev.on('messages.update', m => {
        console.log('RECEBENDO messages.update')
        console.log(m)
    })

    // EVENTOS DISPONIVEIS
    /** set chats (history sync), chats are reverse chronologically sorted */
    sock.ev.on('chats.set', item => {
        console.log('RECEBENDO chats.set')
        console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`)
    })
    /** set messages (history sync), messages are reverse chronologically sorted */
    sock.ev.on('messages.set', item => {
        console.log('RECEBENDO messages.set')
        console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`)
    })
    /** set contacts (history sync) */
    sock.ev.on('contacts.set', item => {
        console.log('RECEBENDO contacts.set')
        console.log(`recv ${item.contacts.length} contacts`)
    })

    sock.ev.on('message-receipt.update', m => {
        console.log('RECEBENDO message-receipt.update')
        console.log(m)
    })
    /** INUTIL POR ENQUANTO
     sock.ev.on('presence.update', m => {
        console.log('RECEBENDO presence.update')
        console.log(m)
    })
     */
    sock.ev.on('chats.update', m => {
        console.log('RECEBENDO chats.update')
        console.log(m)
    })
    sock.ev.on('contacts.upsert', m => {
        console.log('RECEBENDO contacts.upsert')
        console.log(m)
    })
}
