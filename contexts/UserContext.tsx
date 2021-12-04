import jwtDecode from 'jwt-decode';
import React, { createContext, ReactElement, useState } from 'react'
import environment from '../lib/environment';
import storage from '../lib/storage';
import { AuthenticationToken } from '../models/AuthenticationToken';
import User from '../models/User';
import UserServices from '../services/UserServices';

interface UserContextProps {
  isLogged: boolean,
  userServices: UserServices,
  user: User | null
}

const userContext = createContext({} as UserContextProps);

interface Props {
  children: any
}

function UserProvider({ children }: Props): ReactElement {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null as User | null);
  const userServices = new UserServices({ setUser, setIsLogged });
  return (
    <userContext.Provider
      value={{
        user,
        userServices,
        isLogged
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export { userContext }
export default UserProvider
