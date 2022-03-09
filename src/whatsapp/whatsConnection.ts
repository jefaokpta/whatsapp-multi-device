import makeWASocket, {DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState} from "@adiwajshing/baileys";
import {Boom} from "@hapi/boom";
import {authFileDuplicate, authFileRestore, deleteAuthFile} from "../util/authHandler";
import {sendQrCode} from "../util/qrCodeHandle";
import {messageAnalisator} from "../util/messageHandle";
import {WhatsSocket} from "./whatsSocket";
import {VersionWaWeb} from "../static/versionWaWeb";


const { state, saveState } = useSingleFileAuthState(authFileRestore())
const sock = WhatsSocket.sock

export const connectToWhatsApp = async () => {

    console.log(`USANDO WA v${VersionWaWeb.version.join('.')}`)

    /** connection state has been updated -- WS closed, opened, connecting etc. */
    sock.ev.on('connection.update', (update) => {
        const {connection, lastDisconnect, qr} = update
        if(qr != null) {
            sendQrCode(qr)
        }
        console.log('ESTADO DA CONEXAO ', connection)
        switch (connection) {
            case 'open':
                console.log('SISTEMA LOGADO AO WHATSAPP')
                break
            case 'close':
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('CONEXAO FECHADA POR ', lastDisconnect?.error, 'DATA-HORA ', lastDisconnect?.date, ', reconnecting ', shouldReconnect)
                // reconnect if not logged out
                if (shouldReconnect) {
                    console.log('RECONECTANDO...')
                    setTimeout(() => {
                        connectToWhatsApp()
                    }, 5000)
                } else{
                    console.log('SISTEMA DESLOGADO DO WHATSAPP')
                    console.log('!!! ATENCAO!!! AO LER QR CODE NAO PODE TER MENSAGENS PENDENTES')
                    deleteAuthFile()
                    console.log('ARQUIVO DE AUTENTICACAO DELETADO')
                    console.log('SISTEMA SERA DESLIGADO EM 5 SEGUNDOS')
                    setTimeout(() => {
                        process.exit(1)
                    }, 5000)
                }
                break
            case undefined:
                console.log('CONEXAO DESCONHECIDA DESCARTANDO...')
                return
        }
    })

    sock.ev.on('messages.upsert',  m => {
        console.log('Mensagem recebida UPSERT ')
        console.log(JSON.stringify(m, undefined, 2))
        const message  = m.messages[0]
        console.log(message)
        if(message.key.remoteJid === 'status@broadcast'){
            console.log('Mensagem de status@broadcast recebida e ignorada')
            return
        }
        messageAnalisator(message)
    })

    /** ATUALIZACAO DE STATUS DE MSG ENVIADA */
    sock.ev.on('messages.update', m => {
        console.log('RECEBENDO messages.update')
        console.log(m)
    })

    /** ATUALIZA ARQUIVO AUTHS */
    sock.ev.on('creds.update',  () => {
        console.log('ATUALIZANDO CREDS')
        saveState()
        authFileDuplicate()
    })

    /** EVENTOS DISPONIVEIS - INUTEIS POR ENQUANTO */
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
