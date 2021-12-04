import storage from "../lib/storage";
import { AuthenticationToken } from "../models/AuthenticationToken";

export default class TokensServices {
    constructor() { }
    async storeAuthenticationTokens(authenticationToken: AuthenticationToken) {
        try {
            await storage.save({ key: "token", data: authenticationToken.token });
            await storage.save({ key: "refresh-token", data: authenticationToken.refreshToken });
        } catch (err: any) {
            console.log(err.message);
        }
    }
    async _getLocalTokenByName(name: string): Promise<string> {
        try {
            const localToken = await storage.load<string>({ key: name });
            return localToken;
        } catch (err: any) {
            console.log(err.message);
            return "";
        }
    }
    async getLocalToken(): Promise<string> {
        return await this._getLocalTokenByName("token");
    }
    async getLocalRefreshToken(): Promise<string> {
        return await this._getLocalTokenByName("refresh-token");
    }
}