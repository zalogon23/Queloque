import jwtDecode from 'jwt-decode';
import React, { createContext, ReactElement, useState } from 'react'
import environment from '../lib/environment';
import storage from '../lib/storage';
import { AuthenticationToken } from '../models/AuthenticationToken';
import User from '../models/User';

interface TokenClaims {
  exp: number
}

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
    const localToken = await getLocalTokenByName("token");
    const localRefreshToken = await getLocalTokenByName("refresh-token");
    const decodedToken = jwtDecode<TokenClaims>(localToken);
    const isTokenExpired = decodedToken.exp * 1000 < Date.now();
    if (isTokenExpired && localRefreshToken) {
      const authenticationTokens = await getRefreshedAuthenticationTokens(localRefreshToken);
      const isSuccesfullyRefreshed = authenticationTokens !== null;
      if (!isSuccesfullyRefreshed) return localToken;
      await storeAuthenticationTokens(authenticationTokens);
      return authenticationTokens.token;
    }
    return localToken; // Default: ""
  }
  async function login(
    username: string,
    password: string
  ) {
    try {
      const authenticationTokens = await getAuthenticationTokens(username, password);
      const isSuccesfullyAuthenticated = authenticationTokens !== null;
      if (!isSuccesfullyAuthenticated) return;
      await storeAuthenticationTokens(authenticationTokens)
      const userData = await getSelf(authenticationTokens);
      const isUserReceived = userData !== null;
      if (!isUserReceived) return;
      const user = createUser(userData);
      setUser(user);
      setIsLogged(true);
    } catch (err: any) {
      console.log(err.message);
    }
  }
}

async function getAuthenticationTokens(username: string, password: string): Promise<AuthenticationToken | null> {
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
async function getRefreshedAuthenticationTokens(refreshToken: string): Promise<AuthenticationToken | null> {
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
async function storeAuthenticationTokens(authenticationToken: AuthenticationToken) {
  try {
    await storage.save({ key: "token", data: authenticationToken.token });
    await storage.save({ key: "refresh-token", data: authenticationToken.refreshToken });
  } catch (err: any) {
    console.log(err.message);
  }
}
async function getSelf(authenticationToken: AuthenticationToken): Promise<User | null> {
  try {
    const response = await fetch(`${environment.domain}/api/self`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `bearer ${authenticationToken.token}`
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
function createUser(userData: User): User {
  const user = new User({
    id: userData.id,
    username: userData.username,
    description: userData.description,
    avatar: userData.avatar
  });
  return user;
}
async function getLocalTokenByName(name: string): Promise<string> {
  try {
    const localToken = await storage.load<string>({ key: name });
    return localToken;
  } catch (err: any) {
    console.log(err.message);
    return "";
  }
}

export { userContext }
export default UserProvider
