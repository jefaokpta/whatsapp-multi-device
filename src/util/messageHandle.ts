import {downloadContentFromMessage, proto} from "@adiwajshing/baileys";
import axios from "axios";
import {mediaFolder, urlBase} from "../static/staticVar";
import {MessageData} from "../model/messageData";
import * as fs from "fs";
import IWebMessageInfo = proto.IWebMessageInfo;
import {WaitSurveyResponse} from "../static/WaitSurveyResponse";
import IMessage = proto.IMessage;

export async function messageAnalisator(message: IWebMessageInfo) {
    const messageData = new MessageData(
        message.key,
        null,
        message.messageTimestamp,
        message.status || 0,
        process.env.COMPANY || "18",
        process.env.API_PORT || "3007",
        false
    )

    if(WaitSurveyResponse.hasWaitSurvey(message.key.remoteJid!)){ // PASSANDO DE 4 MINUTOS APAGA O SURVEY
        const diffMinutes = getDiffMinutes(WaitSurveyResponse.getWaitSurvey(message.key.remoteJid!) || new Date())
        console.log(';;;;;;;;;;;;; SURVEY DIFF MINUTES  ' + diffMinutes)
        if(diffMinutes > 4){
            WaitSurveyResponse.getAndDeleteWaitSurvey(message.key.remoteJid!)
        }
    }

    if(message.message?.audioMessage){
        await audioMessage(messageData, message);
    }else if(message.message?.documentMessage){
        await documentMessage(messageData, message);
    }else if(message.message?.videoMessage){
        await videoMessage(messageData, message);
    }else if(message.message?.imageMessage){
        await imageMessage(messageData, message);
    }else if(message.message?.buttonsMessage){
        console.log('::::::::: BOTAO PERGUNTA')
        console.log(message)
        return
    }else if(message.message?.buttonsResponseMessage){
        console.log(';;;;;;;;;;;; BOTAO RESPOSTA')
        console.log(message)
        messageData.message = message.message
        return axios.post(`${urlBase}/api/messages/responses`, messageData)
    }else if(WaitSurveyResponse.hasWaitSurvey(message.key.remoteJid!) && !message.key.fromMe){ // GAMBIARRA PARA O RESPOSTA DA PESQUISA
        WaitSurveyResponse.getAndDeleteWaitSurvey(message.key.remoteJid!)
        console.log(';;;;;;;;;;;; RECEBIDO BOTAO RESPOSTA FAKE')
        console.log(message)
        messageData.message = fakeButtonMessageResponse(message)
        return axios.post(`${urlBase}/api/messages/responses`, messageData)
    } else if(message.message?.contactMessage){
        console.log(';;;;;;;;;;;;; RECEBIDO CONTATO')
        const vcardCuted = message.message.contactMessage.vcard!!.split('waid=')[1];
        messageData.message = {
            conversation: `${message.message.contactMessage.displayName}: ${vcardCuted.split(':')[0]}`
        }
    }else if(message.message?.contactsArrayMessage){
        console.log(';;;;;;;;;;;;; RECEBIDO ARRAY CONTATOS')
        messageData.message = {conversation: ''}
        message.message.contactsArrayMessage.contacts!!.forEach(contact => {
            const vcardCuted = contact.vcard!!.split('waid=')[1];
            messageData.message!!.conversation += `${contact.displayName}: ${vcardCuted.split(':')[0]} \n`
        })
    }else{ // TEXT MESSAGE OR OTHER UNKNOWN MESSAGE YET
        messageData.message = message.message
    }
    return axios.post(`${urlBase}/api/messages`, messageData)
}

function getDiffMinutes(surveyTime: Date): number {
    const diff = new Date().getTime() - surveyTime.getTime();
    return Math.floor(diff / (1000 * 60));
}

function fakeButtonMessageResponse(message: IWebMessageInfo){
    const responseText = message.message?.conversation || message.message?.extendedTextMessage?.text || 0
    let responseNumber = 0
    if (typeof responseText === "string") {
        responseNumber = parseInt(responseText)
        if(isNaN(responseNumber)){
            responseNumber = 0
        }
    }
    if(responseNumber > 3) {
        responseNumber = 0
    }
    console.log(';;;;;;;;;;;;; RESPONSE NUMBER  ' + responseNumber)
const fakeButtonResponse: IMessage ={
        buttonsResponseMessage: {
            selectedButtonId: responseNumber.toString(),
        }
}
    return fakeButtonResponse
}

async function audioMessage(messageData: MessageData, message: IWebMessageInfo){
    messageData.mediaMessage = true
    messageData.mediaType = 'AUDIO'
    const mimeTypeMedia = defineMimeTypeAudioMedia(message);
    const filePath  = `${mediaFolder}/audio-${message.key.id}.${mimeTypeMedia}`
    messageData.mediaUrl = filePath
    // @ts-ignore
    const stream = await downloadContentFromMessage(message.message!!.audioMessage, 'audio')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    // save to file
    fs.writeFileSync(filePath, buffer)
}

function defineMimeTypeAudioMedia(message: IWebMessageInfo){
    if(message.message?.audioMessage?.mimetype?.includes('ogg')){
        return 'ogg'
    } else if(message.message?.audioMessage?.mimetype?.includes('mp4')){
        return 'mp4'
    } else{
        return 'mpeg'
    }
}

async function documentMessage(messageData: MessageData, message: IWebMessageInfo) {
    messageData.mediaMessage = true
    messageData.mediaType = 'DOCUMENT'
    const fileTitle = message.message!!.documentMessage!!.fileName
    const fileExtension = fileTitle!!.substring(fileTitle!!.lastIndexOf('.'))
    const filePath = `${mediaFolder}/document-${message.key.id}${fileExtension}`
    // @ts-ignore
    const stream = await downloadContentFromMessage(message.message!!.documentMessage, 'document')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    // save to file
    fs.writeFileSync(filePath, buffer)
    messageData.mediaUrl = filePath
    messageData.mediaFileLength = message.message?.documentMessage?.fileLength
    messageData.mediaPageCount = message.message?.documentMessage?.pageCount
    messageData.mediaFileTitle = fileTitle
}

async function videoMessage(messageData: MessageData, message: IWebMessageInfo){
    messageData.mediaMessage = true
    messageData.mediaType = 'VIDEO'
    const filePath  = `${mediaFolder}/video-${message.key.id}.mp4`
    messageData.mediaUrl = filePath
    // @ts-ignore
    const stream = await downloadContentFromMessage(message.message!!.videoMessage, 'video')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    // save to file
    fs.writeFileSync(filePath, buffer)
    if (message.message?.videoMessage?.caption) {
        messageData.mediaCaption = message.message.videoMessage.caption
    }
}

async function imageMessage(messageData: MessageData, message: IWebMessageInfo){
    messageData.mediaMessage = true
    messageData.mediaType = 'IMAGE'
    const mimeTypeMedia = message.message?.imageMessage?.mimetype?.split('/')[1]
    const filePath  = `${mediaFolder}/image-${message.key.id}.${mimeTypeMedia}`
    // @ts-ignore
    const stream = await downloadContentFromMessage(message.message!!.imageMessage, 'image')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    // save to file
    fs.writeFileSync(filePath, buffer)
    messageData.mediaUrl = filePath
    if(message.message?.imageMessage?.caption){
        messageData.mediaCaption = message.message.imageMessage.caption
    }
}
