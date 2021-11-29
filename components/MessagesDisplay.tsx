import { Heading, Text, VStack } from 'native-base'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { messagesContext, PrivateMessage, PublicMessage } from '../contexts/MessagesContext'

interface Props {

}

function MessagesDisplay({ }: Props): ReactElement {
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
            <Heading>{message.senderId}</Heading>
            <Text>{message.content}</Text>
          </VStack>
        ))
      }
    </VStack>
  )
}

export default MessagesDisplay
