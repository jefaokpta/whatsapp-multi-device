import express from 'express';
import {connectToWhatsApp} from "./whatsapp/whatsConnection";
import {
    blockContact,
    buttonMessageController, isOnWhatsapp,
    mediaMessageController,
    messageController
} from "./controller/messageController";
import {fetchLatestBaileysVersion} from "@whiskeysockets/baileys";
import {VersionWaWeb} from "./static/versionWaWeb";
import {profilePicture} from "./controller/profilePictureController";
const port = process.env.PORT || 3007

const router = express()
router.use(express.json())

// run in main file
fetchLatestBaileysVersion()
    .then(({version, isLatest}) => {
        // VersionWaWeb.version = version
        connectToWhatsApp(VersionWaWeb.version)
    })

router.use('/whats/messages', messageController)
router.use('/whats/messages/buttons', buttonMessageController)
router.use('/whats/messages/medias', mediaMessageController)
router.use('/whats/profile/picture', profilePicture)
router.use('/whats/contacts/block', blockContact)
router.use('/whats/contacts/is-on-whats', isOnWhatsapp)

router.listen(port, () => {
    console.log(`Server iniciou na porta ${port}! 🚀`);
});
