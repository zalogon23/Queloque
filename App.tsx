import { Heading, NativeBaseProvider } from "native-base";
import React, { useContext, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MessagesProvider, { messagesContext } from "./contexts/MessagesContext";
import UserProvider from "./contexts/UserContext";
import Chat from "./screens/Chat";

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <MessagesProvider>
          <NativeBaseProvider>
            <Chat />
          </NativeBaseProvider>
        </MessagesProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
