import {useSingleFileAuthState} from "@adiwajshing/baileys";
import {authFileRestore} from "../util/authHandler";


const { state, saveState } = useSingleFileAuthState(authFileRestore())
export class AuthState {

    static state = state;
    static saveState = saveState;
}
