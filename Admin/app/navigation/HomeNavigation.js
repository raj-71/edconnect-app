import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/DashboardScreen";
import ChatScreen from "../screens/ChatScreen";
import PairDetailScreen from "../screens/PairDetailScreen";

const Stack = createStackNavigator();

const HomeStackNavigation = () => (
  <Stack.Navigator
    initialRouteName={"Dashboard"}
    screenOptions={{
      headerTintColor: "white",
      headerStatusBarHeight: 30,
      headerStyle: { backgroundColor: "tomato" },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: "Admin Portal" }}
    />
    <Stack.Screen name="Pair Details" component={PairDetailScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

export default HomeStackNavigation;
