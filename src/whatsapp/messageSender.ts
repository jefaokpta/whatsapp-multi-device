import {MessageApi} from "../model/messageApi";
import {mediaFolder} from "../static/staticVar";
import {MediaMessage} from "../model/mediaMessage";
import {ConnectionCenter} from "./ConnectionCenter";
import util from "util";
import {WaitSurveyResponse} from "../static/WaitSurveyResponse";


const exec =  util.promisify(require("child_process").exec);

const FILE_URL = `${mediaFolder}/outbox`

export function sendTxt(message: MessageApi) {
    const sock = ConnectionCenter.getSocket().sock
    sock.sendMessage(message.remoteJid, {text: message.message})
}

export function sendButtonsMessage(message: MessageApi) {
    const sock = ConnectionCenter.getSocket().sock
    // send a buttons message!
    // const buttons = [ // desativado por enquanto até resolver o problema do botão de opção
    //     {buttonId: '3', buttonText: {displayText: '😃'}, type: 1},
    //     {buttonId: '2', buttonText: {displayText: '😐'}, type: 1},
    //     {buttonId: '1', buttonText: {displayText: '😩'}, type: 1}
    // ]
    /**const buttonMediaMessage = { // this is a BUTTON media message
        image: {url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg'},
        caption: message.btnText,
        footer: 'msg de foooter',
        buttons: buttons,
        headerType: 4
    }*/
    // const buttonMessage = { // desativado por enquanto até resolver o problema do botão de opção
    //     text: message.btnText!!,
    //     footer: message.btnFooterText,
    //     buttons: buttons,
    //     headerType: 1
    // }
    // sock.sendMessage (message.remoteJid, buttonMessage)
    WaitSurveyResponse.addWaitSurvey(message.remoteJid, new Date())
    const fakeButtonMessage = `${message.btnText} \n 3 => 😃 \n 2 => 😐 \n 1 => 😩`
    sock.sendMessage (message.remoteJid, {text: fakeButtonMessage})
        .catch(error => console.log('ERRO AO ENVIAR BOTOES ',error))
}

export async function sendMediaMessage(fileUpload: MediaMessage) {
    const sock = ConnectionCenter.getSocket().sock
    sock.sendMessage(fileUpload.remoteJid, await messageOptions(fileUpload))
        //.then((returnedMessage) => console.log('CABOU DE ENVIAR: ', returnedMessage))
        .catch(error => console.log('CAGOU', error))
}

async function messageOptions(fileUpload: MediaMessage) {
    switch (fileUpload.fileType) {
        case 'IMAGE':
            return {
                image: {url: `${FILE_URL}/${fileUpload.filePath}`},
                caption: fileUpload.caption,
                mimetype: imageMimeType(fileUpload.filePath).mimeType,
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
            let audioFile = `${FILE_URL}/${fileUpload.filePath}`
            if (fileUpload.ptt) {
                audioFile = await convertAudioToM4a(fileUpload.filePath)
            }
            return {
                audio: {url: audioFile},
                mimetype: 'audio/mp4',
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

async function convertAudioToM4a(filePath: string) {
    const file = `${FILE_URL}/${filePath}`
    const fileName = filePath.split('.')[0]
    const m4aFile = `${FILE_URL}/${fileName}.m4a`
    const command = `ffmpeg -i ${file} -vn -ar 44100 -ac 1 ${m4aFile} -y`
    try {
        const {error, stdout, stderr} = await exec(command)
        if (error) {
            console.log('ERRO AO CONVERTER AUDIO: ', error)
            return file
        }
        console.log('AUDIO M4A CONVERTIDO COM SUCESSO: ', m4aFile)
        return m4aFile
    } catch (errorTry) {
        console.log('ERRO AO CONVERTER AUDIO: ', errorTry)
        return file
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
