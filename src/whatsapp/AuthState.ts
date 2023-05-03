import {AuthenticationState} from "@adiwajshing/baileys";

export class AuthState {

    static state: AuthenticationState;
    static saveState: () => Promise<void>;

    constructor(state: AuthenticationState, saveCreds: () => Promise<void>) {
        AuthState.state = state;
        AuthState.saveState = saveCreds;
    }
}
