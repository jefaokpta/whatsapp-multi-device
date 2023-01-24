import express from "express";
import {
    blockUnblockContact,
    checkIfIsOnWhatsapp,
    sendButtonsMessage,
    sendMediaMessage,
    sendTxt
} from "../whatsapp/messageSender";


export const messageController = express()
export const mediaMessageController = express()
export const buttonMessageController = express()
export const blockContact = express()
export const isOnWhatsapp = express()

messageController.post('/', (req, res) => {
    sendTxt(req.body)
    res.sendStatus(200)
})

isOnWhatsapp.post('/', (req, res) => {
    checkIfIsOnWhatsapp(req.body.telNumber)
        .then((isOn) => res.send(isOn.length > 0))
        .catch((error) => res.send(error))
})

blockContact.post('/', (req, res) => {
    blockUnblockContact(req.body)
    res.status(200).send()
})

buttonMessageController.post('/', (req, res) => {
    sendButtonsMessage(req.body)
    res.sendStatus(200)
})

mediaMessageController.post('/', (req, res) => {
    console.log('ENVIANDO MEDIA MESSAGE ', req.body)
    sendMediaMessage(req.body)
    res.sendStatus(200)
})
