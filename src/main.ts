import express from 'express';
import {connectToWhatsApp} from "./whatsapp/whatsConnection";
import {buttonMessageController, mediaMessageController, messageController} from "./controller/messageController";
import {fetchLatestBaileysVersion} from "@adiwajshing/baileys";
import {VersionWaWeb} from "./static/versionWaWeb";
import {profilePicture} from "./controller/profilePictureController";
const port = process.env.PORT || 3007

const router = express()
router.use(express.json())

// run in main file
fetchLatestBaileysVersion()
    .then(({version, isLatest}) => {
        VersionWaWeb.version = version
        connectToWhatsApp()
    })

router.use('/whats/messages', messageController)
router.use('/whats/messages/buttons', buttonMessageController)
router.use('/whats/messages/medias', mediaMessageController)
router.use('/whats/profile/picture', profilePicture)

router.listen(port, () => {
    console.log(`Server iniciou na porta ${port}! 🚀`);
});
