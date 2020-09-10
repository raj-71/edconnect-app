import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "../config/styles";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OfflineNotice from "../components/offlineNotice";
import AuthContext from "../auth/context";
import chatApi from "../api/chat";
let width;
width = Dimensions.get("window").width / 3;

function MentorDashboardScreen({ navigation }) {
  const { user, setchatMessages } = useContext(AuthContext);

  useEffect(() => {
    if (user.pairId) chatApi.initiateSocket(user.pairId);

    getMessages();
  }, []);

  const getMessages = async () => {
    const response = await chatApi.getAllMessages();
    if (response.ok) {
      let message = response.data.reverse();
      return setchatMessages(message);
    }
  };

  return (
    <Screen>
      <OfflineNotice />
      <View>
        <StatusBar backgroundColor={"#f79257"} />
      </View>
      <View style={style.greeting}>
        <Text style={style.greetingText1}>Hi,{user.name}</Text>
        {user.role === "mentor" ? (
          <Text style={style.greetingText2}>
            "The Art of Mentoring is the Art of Assisting Discovery"
          </Text>
        ) : (
          <Text style={style.greetingText2}>
            "Education is the most powerful weapon which you can use to change
            the world."
          </Text>
        )}
      </View>
      <View style={style.dashboard}>
        <View style={style.column}>
          <TouchableWithoutFeedback
            style={style.tabs}
            onPress={() => navigation.navigate("MyPlanner")}
          >
            <View style={style.icon}>
              <MaterialCommunityIcons
                name="timetable"
                size={80}
                color="white"
              />
              <Text style={style.iconText}>My Planner</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={style.tabs}
            onPress={() => navigation.navigate("Chat")}
          >
            <View style={style.icon}>
              <MaterialCommunityIcons
                name="chat-processing"
                size={80}
                color="white"
              />
              {user.role === "mentor" ? (
                <Text style={style.iconText}>Chat with Mentee</Text>
              ) : (
                <Text style={style.iconText}>Chat with Mentor</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={style.column}>
          <TouchableWithoutFeedback
            style={style.tabs}
            onPress={() => navigation.navigate("Mentee Details")}
          >
            <View style={style.icon}>
              <MaterialCommunityIcons name="school" size={80} color="white" />
              {user.role === "mentor" ? (
                <Text style={style.iconText}>My Mentee</Text>
              ) : (
                <Text style={style.iconText}>My Mentor</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={style.tabs}
            onPress={() => navigation.navigate("Report")}
          >
            <View style={style.icon}>
              <MaterialCommunityIcons
                name="newspaper"
                size={80}
                color="white"
              />
              <Text style={style.iconText}>Report/Query</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Screen>
  );
}

const style = StyleSheet.create({
  header: {
    backgroundColor: styles.colors.primary,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 24,
    color: styles.colors.white,
    textAlign: "center",
  },
  dashboard: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    paddingTop: 50,
  },
  column: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  icon: {
    backgroundColor: "#0c0c0c",
    flexBasis: width,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 2,
  },
  iconText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  greeting: {
    marginTop: 20,
  },
  greetingText1: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "600",
  },
  greetingText2: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  footer: {
    bottom: 0,
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f0edeb",
  },
  footerHome: {
    backgroundColor: styles.colors.primary,
    position: "absolute",
    left: "42%",
    bottom: "50%",
    padding: 15,
    borderRadius: 50,
  },
});

export default MentorDashboardScreen;
