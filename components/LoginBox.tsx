import { Box, Button, FormControl, Heading, Input, VStack } from 'native-base'
import React, { ReactElement, useContext, useState } from 'react'
import { messagesContext } from '../contexts/MessagesContext';
import environment from '../lib/environment';

interface Props {

}

function LoginBox({ }: Props): ReactElement {
  const { setToken } = useContext(messagesContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        onPress={login}
      >
        Enviar
      </Button>
    </VStack>
  )

  async function login() {
    const response = await fetch(`${environment.domain}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    if (!response.ok) return;
    const token = (await response.json()) as string;
    setToken(token);
  }
}

export default LoginBox
