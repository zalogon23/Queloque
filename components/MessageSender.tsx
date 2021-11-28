import { Button, FormControl, Input, VStack } from 'native-base'
import React, { ReactElement, useContext, useState } from 'react'
import { messagesContext } from '../contexts/MessagesContext';

interface Props {

}

function MessageSender({ }: Props): ReactElement {
  const [message, setMessage] = useState("");
  const { sendPublicMessage: sendPublicMessageContext } = useContext(messagesContext);
  return (
    <VStack>
      <FormControl>
        <FormControl.Label>Mensaje</FormControl.Label>
        <Input
          type="text"
          value={message}
          onChangeText={text => setMessage(text)}
        />
      </FormControl>
      <Button
      mt="4"
        onPress={sendPublicMessage}
      >
        Enviar
      </Button>
    </VStack>
  )

  async function sendPublicMessage() {
    if (message.length) {
      sendPublicMessageContext({
        content: message,
        latitude: 11,
        longitude: 11,
        senderId: ""
      })
      setMessage("");
    }
  }
}

export default MessageSender
