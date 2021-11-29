import { Heading } from 'native-base'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import Container from '../components/basics/Container'
import LoginBox from '../components/LoginBox'
import MessagesDisplay from '../components/MessagesDisplay'
import MessageSender from '../components/MessageSender'
import { messagesContext } from '../contexts/MessagesContext'
import { userContext } from '../contexts/UserContext'

interface Props {

}

function Chat({ }: Props): ReactElement {
  const { getToken, isLogged } = useContext(userContext);
  const { createConnection } = useContext(messagesContext);
  useEffect(() => {
    if (isLogged) {
      createConnection(getToken)
    }
  }, [isLogged])
  return (
    <Container>
      <Heading
        pb="6"
      >
        Chat Publico
      </Heading>
      {!isLogged && <LoginBox />}
      {isLogged && <MessageSender />}
      <MessagesDisplay />
    </Container>
  )
}

export default Chat
