import {proto} from "@whiskeysockets/baileys";
import IMessage = proto.IMessage;
import IMessageKey = proto.IMessageKey;

export class MessageData {
    key: IMessageKey
    message: IMessage | null | undefined
    messageTimestamp: number | Long | null | undefined
    status: number
    company: string | undefined
    instanceId: string | undefined
    mediaMessage: boolean
    mediaType: string | undefined
    mediaUrl: string | undefined
    mediaFileLength: number | Long | null | undefined
    mediaPageCount: number | null | undefined
    mediaFileTitle: string | null | undefined
    mediaCaption: string | null | undefined

    constructor(key: proto.IMessageKey,
                message: proto.IMessage | null | undefined,
                messageTimestamp: number|Long|null|undefined,
                status: number,
                company: string | undefined,
                instanceId: string | undefined,
                mediaMessage: boolean,
    ) {
        this.key = key
        this.message = message
        this.messageTimestamp = messageTimestamp
        this.status = status
        this.company = company
        this.instanceId = instanceId
        this.mediaMessage = mediaMessage
    }

}
