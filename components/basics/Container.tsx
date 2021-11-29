import React, { ReactElement } from 'react'
import { Container as NativeContainer, ScrollView } from "native-base"
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
  children: any
}

function Container({ children }: Props): ReactElement {
  return (
    <SafeAreaView>
      <ScrollView>
        <NativeContainer
          mx="auto"
          py="6"
          alignItems="center"
        >
          {children}
        </NativeContainer>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Container
