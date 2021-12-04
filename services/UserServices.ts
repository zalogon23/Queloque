import jwtDecode from "jwt-decode";
import environment from "../lib/environment";
import { AuthenticationToken } from "../models/AuthenticationToken";
import User from "../models/User";
import TokensServices from "./TokensServices";

interface TokenClaims {
    exp: number
}

interface ConstructorProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>,
}

export default class UserServices {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    TokensServices = new TokensServices();
    constructor({
        setUser,
        setIsLogged
    }: ConstructorProps) {
        this.setIsLogged = setIsLogged;
        this.setUser = setUser;
    }
    login = async (username: string, password: string) => {
        try {
            const authenticationTokens = await this._getAuthenticationTokens(username, password);
            const isSuccesfullyAuthenticated = authenticationTokens !== null;
            if (!isSuccesfullyAuthenticated) return;
            await this._storeAuthenticationTokens(authenticationTokens)
            const userData = await this._getSelf(authenticationTokens);
            const isUserReceived = userData !== null;
            if (!isUserReceived) return;
            const user = this._createUser(userData);
            this.setUser(user);
            this.setIsLogged(true);
        } catch (err: any) {
            console.log(err.message);
        }
    }
    getToken = async () => {
        const localToken = await this._getLocalToken();
        const localRefreshToken = await this._getLocalRefreshToken();
        const decodedToken = jwtDecode<TokenClaims>(localToken);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired && localRefreshToken) {
            const authenticationTokens = await this._getRefreshedAuthenticationTokens(localRefreshToken);
            const isSuccesfullyRefreshed = authenticationTokens !== null;
            if (!isSuccesfullyRefreshed) return localToken;
            await this._storeAuthenticationTokens(authenticationTokens);
            return authenticationTokens.token;
        }
        return localToken; // Default: ""
    }
    async _getAuthenticationTokens(username: string, password: string): Promise<AuthenticationToken | null> {
        try {
            const response = await fetch(`${environment.domain}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            if (!response.ok) return null;
            const authTokens = await response.json() as AuthenticationToken;
            return authTokens;
        } catch (err: any) {
            console.log(err.message);
            return null;
        }
    }
    async _getRefreshedAuthenticationTokens(refreshToken: string) {
        try {
            const response = await fetch(`${environment.domain}/api/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    refreshToken
                })
            });
            if (response.ok) {
                const authenticationToken = await response.json() as AuthenticationToken;
                return authenticationToken;
            }
            return null;
        } catch (err: any) {
            console.log(err.message);
            return null;
        }
    }
    async _getSelf(authenticationTokens: AuthenticationToken): Promise<User | null> {
        try {
            const response = await fetch(`${environment.domain}/api/self`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `bearer ${authenticationTokens.token}`
                }
            });
            if (!response.ok) return null;
            const user = await response.json() as User;
            return user;
        } catch (err: any) {
            console.log(err.message);
            return null;
        }
    }
    _createUser(userData: User): User {
        const user = new User({
            id: userData.id,
            username: userData.username,
            description: userData.description,
            avatar: userData.avatar
        });
        return user;
    }
    async _storeAuthenticationTokens(authenticationTokens: AuthenticationToken) {
        try {
            await this.TokensServices.storeAuthenticationTokens(authenticationTokens);
        } catch (err: any) {
            console.log(err.message);
        }
    }
    async _getLocalToken(): Promise<string> {
        return await this.TokensServices.getLocalToken();
    }
    async _getLocalRefreshToken(): Promise<string> {
        return await this.TokensServices.getLocalRefreshToken();
    }
}