import express from "express";
import {sendMediaMessage, sendTxt} from "../whatsapp/messageSender";


export const messageController = express()
export const mediaMessageController = express()
export const buttonMessageController = express()

messageController.post('/', (req, res) => {
    console.log(req.body)
    sendTxt(req.body)
    res.sendStatus(200)
})

buttonMessageController.post('/', (req, res) => {
    //sendButtonsMessage(req.body)
    res.sendStatus(200)
})

mediaMessageController.post('/', (req, res) => {
    console.log('ENVIANDO IMAGEM ', req.body)
    sendMediaMessage(req.body)
    res.sendStatus(200)
})
