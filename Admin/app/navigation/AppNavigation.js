import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeButton from "./HomeButton";
import HomeStackNavigation from "./HomeNavigation";
import RegisterPair from "../screens/RegisterPair";
import RegisterAdmin from "../screens/registerAdmin";

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "tomato",
        keyboardHidesTabBar: true,
        showLabel: false,
      }}
      initialRouteName={"Dashboard"}
    >
      <Tab.Screen
        name="Chat"
        component={RegisterAdmin}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="account-badge"
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
        name="Register Pair"
        component={RegisterPair}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="pen-plus"
              color={"#3c3c3d"}
              size={35}
            />
          ),
          title: "Register Pair",
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;
