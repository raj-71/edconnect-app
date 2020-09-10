import React from "react";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import MentorDashboardScreen from "../screens/MentorDashboardScreen";
import MyPlannerScreen from "../screens/MyPlannerScreen";
import ChatScreen from "../screens/ChatScreen";
import ReportScreen from "../screens/ReportScreen";
import MenteeDetailScreen from "../screens/MenteeDetailScreen";

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
      component={MentorDashboardScreen}
      options={{ title: "Edjustice's EdConnect App" }}
    />
    <Stack.Screen
      name="MyPlanner"
      component={MyPlannerScreen}
      headerMode="none"
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Report" component={ReportScreen} />
    <Stack.Screen name="Mentee Details" component={MenteeDetailScreen} />
  </Stack.Navigator>
);

export default HomeStackNavigation;
