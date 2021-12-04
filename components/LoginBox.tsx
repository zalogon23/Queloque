import { Box, Button, FormControl, Heading, Input, VStack } from 'native-base'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { userContext } from '../contexts/UserContext';

interface Props {

}

function LoginBox({ }: Props): ReactElement {
  const { userServices } = useContext(userContext);
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
        onPress={() => userServices.login(username, password)}
      >
        Enviar
      </Button>
    </VStack>
  )
}

export default LoginBox
