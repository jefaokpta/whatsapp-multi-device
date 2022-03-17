import express from "express";
import {ConnectionCenter} from "../whatsapp/ConnectionCenter";

export const profilePicture = express()

profilePicture.get('/:remoteJid', (req, res) => {
    const sock = ConnectionCenter.getSocket().sock
    sock.profilePictureUrl(req.params.remoteJid)
        .then(data => {
            //console.log(data)
            res.json({picture: data})
        })
        .catch(error => {
            console.log(error.message)
            res.status(404).json({
                errorMessage: error.message
            })
        })
})
