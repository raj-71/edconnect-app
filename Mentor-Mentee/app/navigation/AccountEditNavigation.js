import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MentorAccountScreen from "../screens/MentorAccountScreen";
import MentorAccountEdit from "../screens/MentorAccountEdit";

const Stack = createStackNavigator();

const AccountEditNavigation = () => (
  <Stack.Navigator
    initialRouteName={"Account"}
    screenOptions={{
      headerTintColor: "white",
      headerStyle: { backgroundColor: "tomato" },
    }}
  >
    <Stack.Screen
      name="Account"
      component={MentorAccountScreen}
      options={{ title: "Profile" }}
    />
    <Stack.Screen name="Edit Profile" component={MentorAccountEdit} />
  </Stack.Navigator>
);

export default AccountEditNavigation;
