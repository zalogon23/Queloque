import { Heading } from 'native-base'
import React, { ReactElement, useContext, useState } from 'react'
import Container from '../components/basics/Container'
import LoginBox from '../components/LoginBox'
import MessagesDisplay from '../components/MessagesDisplay'
import MessageSender from '../components/MessageSender'

interface Props {

}

function Chat({ }: Props): ReactElement {
  return (
    <Container>
      <Heading
        pb="6"
      >
        Chat Publico
      </Heading>
      <LoginBox />
      <MessageSender />
      <MessagesDisplay />
    </Container>
  )
}

export default Chat
