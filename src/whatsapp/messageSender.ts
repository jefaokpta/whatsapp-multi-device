import {MessageApi} from "../model/messageApi";
import {mediaFolder} from "../static/staticVar";
import {MediaMessage} from "../model/mediaMessage";
import {AnyMediaMessageContent} from "@adiwajshing/baileys";
import {ConnectionCenter} from "./ConnectionCenter";


const FILE_URL = `${mediaFolder}/outbox`

export function sendTxt(message: MessageApi) {
    const sock = ConnectionCenter.getSocket()?.sock
    sock.sendMessage(message.remoteJid, {text: message.message})
}

export function sendButtonsMessage(message: MessageApi) {
    const sock = ConnectionCenter.getSocket()?.sock
    // send a buttons message!
    const buttons = [
        {buttonId: '3', buttonText: {displayText: '😃'}, type: 1},
        {buttonId: '2', buttonText: {displayText: '😐'}, type: 1},
        {buttonId: '1', buttonText: {displayText: '😩'}, type: 1}
    ]
    /**const buttonMediaMessage = { // this is a BUTTON media message
        image: {url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg'},
        caption: message.btnText,
        footer: 'msg de foooter',
        buttons: buttons,
        headerType: 4
    }*/
    const buttonMessage = {
        text: message.btnText!!,
        footer: message.btnFooterText,
        buttons: buttons,
        headerType: 1
    }
    sock.sendMessage (message.remoteJid, buttonMessage)
        .catch(error => console.log('ERRO AO ENVIAR BOTOES ',error))
}

export function sendMediaMessage(fileUpload: MediaMessage) {
    const sock = ConnectionCenter.getSocket().sock
    sock.sendMessage(fileUpload.remoteJid, messageOptions(fileUpload))
        //.then((returnedMessage) => console.log('CABOU DE ENVIAR: ', returnedMessage))
        .catch(error => console.log('CAGOU', error))
}

function messageOptions(fileUpload: MediaMessage): AnyMediaMessageContent {
    switch (fileUpload.fileType) {
        case 'IMAGE':
            return  {
                image: {url: `${FILE_URL}/${fileUpload.filePath}`},
                caption: fileUpload.caption,
                jpegThumbnail: undefined,
            }
        case 'DOCUMENT':
            return {
                document: {url: `${FILE_URL}/${fileUpload.filePath}`},
                mimetype: 'application/pdf',
                fileName: fileUpload.filePath,
            }
        case 'VIDEO':
            return {
                video: {url: `${FILE_URL}/${fileUpload.filePath}`},
                caption: fileUpload.caption,
                gifPlayback: undefined,
                jpegThumbnail: undefined,
            }
        case 'AUDIO':
            return {
                audio: {url: `${FILE_URL}/${fileUpload.filePath}`},
                mimetype: audioMimeType(fileUpload).mimeType,
                ptt: fileUpload.ptt,
                seconds: undefined
            }
        default:
            return {
                document: {url: `${FILE_URL}/${fileUpload.filePath}`},
                mimetype: 'application/pdf',
                fileName: fileUpload.filePath,
            }
    }
}

function audioMimeType(fileUpload: MediaMessage) {
    if(fileUpload.ptt){
        return {
            messageType: 'audio',
            mimeType: 'audio/ogg'
        }
    }
    return {
        messageType: 'audio',
        mimeType: 'audio/mp4'
    }
}

function imageMimeType(name: string) {
    if(name.substring(name.lastIndexOf('.')) === '.png'){
        return {
            messageType: 'image',
            mimeType: 'image/png'
        }
    }
    return {
        messageType: 'image',
        mimeType: 'image/jpeg'
    }
}
