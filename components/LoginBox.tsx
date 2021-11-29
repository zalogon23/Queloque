import { Box, Button, FormControl, Heading, Input, VStack } from 'native-base'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { messagesContext } from '../contexts/MessagesContext';
import { userContext } from '../contexts/UserContext';
import environment from '../lib/environment';

interface Props {

}

function LoginBox({ }: Props): ReactElement {
  const { login, isUser, getToken } = useContext(userContext);
  const { createConnection } = useContext(messagesContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (isUser) {
      createConnection(getToken)
    }
  }, [isUser])
  return (
    <VStack>
      <Heading
        pb="2"
      >
        Login
      </Heading>
      <FormControl>
        <FormControl.Label>Nombre de usuario</FormControl.Label>
        <Input
          type="text"
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Contraseña</FormControl.Label>
        <Input
          type="password"
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </FormControl>
      <Button
        mt="4"
        onPress={() => login(username, password)}
      >
        Enviar
      </Button>
    </VStack>
  )
}

export default LoginBox
