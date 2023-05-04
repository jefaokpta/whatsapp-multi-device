import express from "express";
import {WhatsappSocket} from "../whatsapp/whatsappSocket";

export const profilePicture = express()

profilePicture.get('/:remoteJid', (req, res) => {
    WhatsappSocket.sock.profilePictureUrl(req.params.remoteJid)
        .then((data: any) => {
            //console.log(data)
            res.json({picture: data.toString()})
        })
        .catch((error: any) => {
            console.log(error.message)
            res.status(404).json({
                errorMessage: error.message
            })
        })
})
