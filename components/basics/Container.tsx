import React, { ReactElement } from 'react'
import { Container as NativeContainer, ScrollView } from "native-base"

interface Props {
  children: any
}

function Container({ children }: Props): ReactElement {
  return (
    <ScrollView>
      <NativeContainer
        mx="auto"
        py="6"
      >
        {children}
      </NativeContainer>
    </ScrollView>
  )
}

export default Container
