import {MessageApi} from "../model/messageApi";
import {messageAnalisator} from "../util/messageHandle";
import {mediaFolder} from "../static/staticVar";
import {MediaMessage} from "../model/mediaMessage";
import {WhatsSocket} from "./whatsSocket";
import * as url from "url";


const sock = WhatsSocket.sock

let frutas: string[]
frutas= ["pera", "manzana", "uva"]

export function sendTxt(message: MessageApi) {
    sock.sendMessage(message.remoteJid, {text: message.message})
}
//
// export function sendButtonsMessage(message: MessageApi) {
//     // send a buttons message!
//     const buttons = [
//         {buttonId: '3', buttonText: {displayText: '😃'}, type: 1},
//         {buttonId: '2', buttonText: {displayText: '😐'}, type: 1},
//         {buttonId: '1', buttonText: {displayText: '😩'}, type: 1}
//     ]
//     const buttonMessage = new ButtonsMessage({
//         contentText: message.btnText,
//         footerText: message.btnFooterText,
//         buttons: buttons,
//         headerType: 1
//     })
//     conn.sendMessage (message.remoteJid, buttonMessage, MessageType.buttonsMessage)
//         .then((messageBuilded) => console.log(messageBuilded.key))
//         .catch(error => console.log(error))
// }
//
export function sendMediaMessage(fileUpload: MediaMessage) {
    const messageDetail = messageDetails(fileUpload)
    sock.sendMessage(fileUpload.remoteJid,
        {
            image: {url: `${mediaFolder}/outbox/${fileUpload.filePath}`},
            caption: fileUpload.caption,
            mimetype: messageDetail.mimeType,
            ptt: fileUpload.ptt,
            fileName: fileUpload.filePath
        })
        .then((returnedMessage) => console.log(returnedMessage.key))
        .catch(error => console.log(error))
}

function messageDetails(fileUpload: MediaMessage) {
    switch (fileUpload.fileType) {
        case 'IMAGE':
            return  imageMimeType(fileUpload.filePath)
        case 'DOCUMENT':
            return { messageType: 'document', mimeType:'application/pdf'}
        case 'VIDEO':
            return { messageType: 'video', mimeType: 'video/mp4'}
        case 'AUDIO':
            return audioMimeType(fileUpload)
        default:
            return { messageType: 'num sei', mimeType: 'tb/numsei'}
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
