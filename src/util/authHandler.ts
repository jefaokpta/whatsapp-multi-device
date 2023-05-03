import fs from "fs";
import {mediaFolder, urlBase} from "../static/staticVar";
import axios from "axios";

const companyId = process.env.COMPANY || '18'
let authFilePath = `./auth_info_multi-${companyId}.json`
let authFilePathBkp = `${mediaFolder}/auths/auth_info_multi-${companyId}.json`
if(urlBase.split(':').pop() === '9090'){
    authFilePath = `./auth_info_multi-${companyId}-homolog.json`
    authFilePathBkp = `${mediaFolder}/auths/auth_info_multi-${companyId}-homolog.json`
}
// todo: nao é mais um arq.json e sim uma pasta
export function authFileRestore() {
    if (!fs.existsSync(authFilePath)) {
        try {
            fs.copyFileSync(authFilePathBkp, authFilePath)
            console.log('ARQUIVO AUTH RESTAURADO')
        } catch (error) {
            console.log('NAO FOI POSSIVEL RESTAURAR ARQUIVO AUTH ', error)
        }
    }
    return authFilePath
}

export function authFileDuplicate() {
    fs.copyFile(authFilePath, authFilePathBkp, (err) => {
        if (err) console.log('ERRO AO COPIAR AUTH FILE', err)
        else console.log('AUTH FILE COPIADO.');
    });
}

export function deleteAuthFile() {
    fs.unlink(authFilePath, (err) => {
        if (err) console.log('ERRO AO DELETAR AUTH FILE', err)
        else console.log('AUTH FILE PRINCIPAL DELETADO.');
    });
    fs.unlink(authFilePathBkp, (err) => {
        if (err) console.log('ERRO AO DELETAR AUTH FILE', err)
        else console.log('AUTH FILE BACKUP DELETADO.');
    });
}

export function confirmAuthToApi(){
    axios.post(`${urlBase}/api/register/auth/${companyId}`)
        .then(() => {
            console.log('AUTH CONFIRMADA')
        })
        .catch(err => {
            console.log('ERRO 🧨 AO CONFIRMAR AUTH', err.message)
        })
}
