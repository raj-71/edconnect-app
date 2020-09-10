import Bugsnag from '@bugsnag/expo';
Bugsnag.start();

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./app/navigation/AppNavigation";
import NavigationTheme from "./app/navigation/NavigationTheme";
import LoginScreen from "./app/screens/LoginScreen";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { AppLoading } from "expo";

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  if (!isReady)
    return (
      <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)} />
    );

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer theme={NavigationTheme}>
          {user ? <AppNavigation /> : <LoginScreen />}
        </NavigationContainer>
      </AuthContext.Provider>
    </>
  );
}
