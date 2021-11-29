import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react'
import environment from '../lib/environment';
import { userContext } from './UserContext';

interface MessageContextProps {
  onReceivePublicMessage(reaction: (publicMessage: PublicMessage) => any): void,
  sendPublicMessage(publicMessage: PublicMessage): void,
  isConnected: boolean,
  createConnection(getFreshToken: () => Promise<string>): void
}

const messagesContext = createContext({} as MessageContextProps)

interface Props {
  children: ReactElement | ReactElement[] | null
}

export interface PublicMessage {
  latitude: number,
  longitude: number,
  content: string,
  senderId: string
}

function MessagesProvider({ children }: Props): ReactElement {
  const [connection, setConnection] = useState(null as null | HubConnection);
  const [isConnected, setIsConnected] = useState(false);
  return (
    <messagesContext.Provider value={{
      onReceivePublicMessage,
      sendPublicMessage,
      createConnection,
      isConnected
    }}>
      {children}
    </messagesContext.Provider>
  )
  function onReceivePublicMessage(reaction: (publicMessage: PublicMessage) => any) {
    try {
      connection?.on("ReceivePublicMessage", (publicMessage) => reaction(publicMessage))
    } catch (e: any) {
      console.log(e.message)
    }
  }
  function sendPublicMessage(publicMessage: PublicMessage) {
    try {
      connection?.invoke("SendMessage", publicMessage);
    } catch (e: any) {
      console.log(e.message)
    }
  }
  function createConnection(getFreshToken: () => Promise<string>) {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${environment.domain}/chatHub`, {
        accessTokenFactory: async () => {
          const token = await getFreshToken()
          console.log("This is the received token: " + token);
          return token;
        },
        transport: HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build()
    setConnection(newConnection);
    newConnection.start()
      .then(() => {
        console.log("Connected to the chat hub!")
        setIsConnected(true);
      })
      .catch(err => console.log(err.message))
  }
}

export { messagesContext }
export default MessagesProvider
