import { Button, FormControl, Input, VStack } from 'native-base'
import React, { ReactElement, useContext, useState } from 'react'
import { messagesContext } from '../contexts/MessagesContext';
import { userContext } from '../contexts/UserContext';
import { To } from '../screens/Chat';

interface Props {
  to: To
}

function MessageSender({ to }: Props): ReactElement {
  const [message, setMessage] = useState("");
  const { sendPublicMessage, sendPrivateMessage } = useContext(messagesContext);
  const { user } = useContext(userContext);
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
        onPress={sendMessage}
      >
        Enviar
      </Button>
    </VStack>
  )

  async function sendMessage() {
    if (!to.id) {
      await sendPublicMessageLocal();
    } else {
      await sendPrivateMessageLocal();
    }
  }

  async function sendPublicMessageLocal() {
    if (!user) return;
    if (message.length) {
      sendPublicMessage({
        content: message,
        latitude: 11,
        longitude: 11,
        senderId: user.id,
        senderName: user.username
      })
      setMessage("");
    }
  }

  async function sendPrivateMessageLocal() {
    if (!user) return;
    if (message.length) {
      sendPrivateMessage({
        content: message,
        senderId: user.id,
        senderName: user.username,
        receiverId: to.id
      })
      setMessage("");
    }
  }
}

export default MessageSender
