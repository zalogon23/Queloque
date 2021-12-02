import jwtDecode from 'jwt-decode';
import React, { createContext, ReactElement, useState } from 'react'
import environment from '../lib/environment';
import storage from '../lib/storage';
import { AuthenticationToken } from '../models/AuthenticationToken';
import User from '../models/User';

interface UserContextProps {
  getToken(): Promise<string>,
  isLogged: boolean,
  login: (username: string, password: string) => void,
  user: User | null
}

const userContext = createContext({} as UserContextProps);

interface Props {
  children: any
}

function UserProvider({ children }: Props): ReactElement {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null as User | null);
  return (
    <userContext.Provider
      value={{
        user,
        isLogged,
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

    const responseUser = await fetch(`${environment.domain}/api/self`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `bearer ${authenticationToken.token}`
      }
    });
    if (!responseUser.ok) return;
    const responseUserPayload = await responseUser.json() as User;
    const createdUser = new User({
      id: responseUserPayload.id,
      username: responseUserPayload.username,
      description: responseUserPayload.description,
      avatar: responseUserPayload.avatar
    });
    setUser(createdUser);
    setIsLogged(true);
  }
}

export { userContext }
export default UserProvider
