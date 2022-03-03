import fs from "fs";
import {mediaFolder} from "../static/staticVar";

const companyId = process.env.COMPANY || '12'
const authFilePath = `./auth_info_multi-${companyId}.json`

export function authFileRestore() {
    if (!fs.existsSync(authFilePath)) {
        try {
            fs.copyFileSync(`${mediaFolder}/auths/auth_info_multi-${companyId}.json`, authFilePath)
            console.log('ARQUIVO AUTH RESTAURADO')
        } catch (error) {
            console.log('NAO FOI POSSIVEL RESTAURAR ARQUIVO AUTH ', error)
        }
    }
    return authFilePath
}

export function authFileDuplicate() {
    fs.copyFile(`./auth_info_multi-${companyId}.json`, `./${mediaFolder}/auths/auth_info_multi-${companyId}.json`, (err) => {
        if (err) console.log('ERRO AO COPIAR AUTH FILE', err)
        else console.log('AUTH FILE COPIADO.');
    });
}
