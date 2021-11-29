import jwtDecode from 'jwt-decode';
import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { AsyncStorage } from 'react-native';
import environment from '../lib/environment';
import storage from '../lib/storage';
import { AuthenticationToken } from '../models/AuthenticationToken';

interface UserContextProps {
  getToken(): Promise<string>,
  isUser: boolean,
  login: (username: string, password: string) => void
}

const userContext = createContext({} as UserContextProps);

interface Props {
  children: any
}

function UserProvider({ children }: Props): ReactElement {
  const [isUser, setIsUser] = useState(false);
  return (
    <userContext.Provider
      value={{
        isUser,
        login,
        getToken
      }}
    >
      {children}
    </userContext.Provider>
  )
  async function getToken(): Promise<string> {
    let token = "";
    let refreshToken = "";
    try {
      const localToken = await storage.load<string>({ key: "token" });
      token = localToken;
      const localRefreshToken = await storage.load<string>({ key: "refresh-token" });
      refreshToken = localRefreshToken;
    } catch (err: any) {
      console.log(err.message)
    }
    const decodedToken = jwtDecode<{ exp: number }>(token);
    if (decodedToken.exp * 1000 < Date.now() && refreshToken) {
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
        const authenticationToken = (await response.json()) as AuthenticationToken;
        await storage.save({ key: "token", data: authenticationToken.token });
        await storage.save({ key: "refresh-token", data: authenticationToken.refreshToken });
        return authenticationToken.token;
      }
    }
    return token;
  }
  async function login(username: string, password: string) {
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
    if (!response.ok) return;
    const authenticationToken = (await response.json()) as AuthenticationToken;
    await storage.save({ key: "token", data: authenticationToken.token });
    await storage.save({ key: "refresh-token", data: authenticationToken.refreshToken });
    setIsUser(true);
  }
}

export { userContext }
export default UserProvider
