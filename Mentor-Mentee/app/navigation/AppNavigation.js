import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChatScreen from "../screens/ChatScreen";
import HomeButton from "./HomeButton";
import HomeStackNavigation from "./HomeNavigation";
import AccountEditNavigation from "./AccountEditNavigation";

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
        keyboardHidesTabBar: true,
        showLabel: false,
        activeTintColor: "pink",
      }}
      initialRouteName={"Dashboard"}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="chat-processing"
              color={"#3c3c3d"}
              size={35}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={HomeStackNavigation}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <HomeButton onPress={() => navigation.navigate("Dashboard")} />
          ),
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color={"white"} size={35} />
          ),
        })}
      />
      <Tab.Screen
        name="Account"
        component={AccountEditNavigation}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="account"
              color={"#3c3c3d"}
              size={35}
            />
          ),
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;
