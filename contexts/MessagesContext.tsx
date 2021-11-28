import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { createContext, ReactElement, useEffect, useState } from 'react'
import environment from '../lib/environment';

interface MessageContextProps {
  onReceivePublicMessage(reaction: (publicMessage: PublicMessage) => any): void,
  setToken: React.Dispatch<React.SetStateAction<string>>,
  sendPublicMessage(publicMessage: PublicMessage): void,
  isConnected: boolean
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
  const [token, setToken] = useState("");
  useEffect(() => {
    if (token) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${environment.domain}/chatHub`, {
          accessTokenFactory: () => token
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
  }, [token])
  return (
    <messagesContext.Provider value={{
      onReceivePublicMessage,
      sendPublicMessage,
      setToken,
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
}

export { messagesContext }
export default MessagesProvider
