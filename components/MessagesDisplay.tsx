import { Heading, Text, VStack } from 'native-base'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { messagesContext, PrivateMessage, PublicMessage } from '../contexts/MessagesContext'
import { To } from '../screens/Chat';

interface Props {
  setTo: React.Dispatch<React.SetStateAction<To>>
}

function MessagesDisplay({ setTo }: Props): ReactElement {
  const [messages, setMessages] = useState([] as (PublicMessage | PrivateMessage)[]);
  const { onReceivePublicMessage, onReceivePrivateMessage, isConnected } = useContext(messagesContext);

  useEffect(() => {
    if (isConnected) {
      onReceivePublicMessage((publicMessage) => setMessages(prevMessages => (
        [...prevMessages, publicMessage]
      )))
      onReceivePrivateMessage((privateMessage) => setMessages(prevMessages => (
        [...prevMessages, privateMessage]
      )))
    }
  }, [isConnected])
  return (
    <VStack>
      {
        messages.map((message) => (
          <VStack
            pt="4"
            key={`${message.content}-${message.senderId}`}
          >
            <Heading
              onPress={() => setTo(to => {
                if (to.id == message.senderId) {
                  return { id: "", username: "Todos" }
                }
                return { id: message.senderId, username: message.senderName }
              })}
            >
              {message.senderName}
            </Heading>
            <Text>{message.content}</Text>
          </VStack>
        ))
      }
    </VStack>
  )
}

export default MessagesDisplay
