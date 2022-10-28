import express from "express";
import {blockUnblockContact, sendButtonsMessage, sendMediaMessage, sendTxt} from "../whatsapp/messageSender";


export const messageController = express()
export const mediaMessageController = express()
export const buttonMessageController = express()
export const blockContact = express()

messageController.post('/', (req, res) => {
    sendTxt(req.body)
    res.sendStatus(200)
})

blockContact.post('/', (req, res) => {
    blockUnblockContact(req.body)
    res.sendStatus(200)
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
