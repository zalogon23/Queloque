import { Button, FormControl, Input, VStack } from 'native-base'
import React, { ReactElement, useContext, useState } from 'react'
import { messagesContext } from '../contexts/MessagesContext';

interface Props {

}

function MessageSender({ }: Props): ReactElement {
  const [message, setMessage] = useState("");
  const [to, setTo] = useState("");
  const { sendPublicMessage: sendPublicMessageContext, sendPrivateMessage: sendPrivateMessageContext } = useContext(messagesContext);
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
      <FormControl>
        <FormControl.Label>Para</FormControl.Label>
        <Input
          type="text"
          value={to}
          onChangeText={text => setTo(text)}
        />
      </FormControl>
      <Button
        mt="4"
        onPress={sendMessage}
      >
        Enviar
      </Button>
    </VStack>
  )

  async function sendMessage() {
    if (!to) {
      await sendPublicMessage();
    } else {
      await sendPrivateMessage();
    }
  }

  async function sendPublicMessage() {
    if (message.length) {
      sendPublicMessageContext({
        content: message,
        latitude: 11,
        longitude: 11,
        senderId: "",
        senderName: "Nombre"
      })
      setMessage("");
    }
  }

  async function sendPrivateMessage() {
    if (message.length) {
      sendPrivateMessageContext({
        content: message,
        senderId: "",
        senderName: "Nombre",
        receiverId: to
      })
      setMessage("");
    }
  }
}

export default MessageSender
