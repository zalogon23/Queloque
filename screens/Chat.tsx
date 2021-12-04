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

export interface To {
  id: string,
  username: string
}

function Chat({ }: Props): ReactElement {
  const [to, setTo] = useState({ username: "Todos" } as To);
  const { userServices, isLogged } = useContext(userContext);
  const { createConnection } = useContext(messagesContext);
  useEffect(() => {
    if (isLogged) {
      createConnection(userServices.getToken)
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
      {isLogged && <MessageSender to={to} />}
      {isLogged &&
        <Heading>Para: {to.username}</Heading>
      }
      <MessagesDisplay setTo={setTo} />
    </Container>
  )
}

export default Chat
