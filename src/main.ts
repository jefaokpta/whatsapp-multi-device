import express from 'express';
// for multi-device
import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion, useSingleFileAuthState
} from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'

const app = express();
const port = process.env.PORT || 3000
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

async function connectToWhatsApp() {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`USANDO WHATS WEB  VERSAO ${version.join('.')}, isLatest: ${isLatest}`)

    const sock = makeWASocket({
        auth: state,
        version,
        printQRInTerminal: true
    })

    sock.ev.on('connection.update', (update) => {
        const {connection, lastDisconnect, qr} = update
        console.log('QRCODE AQUI', qr)
        if (connection === 'close') {
            console.log(`Conexión cerrada: ${lastDisconnect}`)
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('conexao fechada por ', lastDisconnect?.error, 'DATA-HORA ', lastDisconnect?.date, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                console.log('RECONECTANDO')
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('conexao aberta')
        }
    })

    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2))

        console.log('respondendo para ', m.messages[0].key.remoteJid)
        await sock.sendMessage(m.messages[0].key.remoteJid!, {text: 'Faaala José!'})
    })

    // listen for when the auth credentials is updated
    sock.ev.on('creds.update', saveState)
}
// run in main file
connectToWhatsApp()

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`🚀 Server iniciou on port ${port}!`);
});
