import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import Screen from "../components/Screen";
import pairApi from "../api/pair";

function ChatScreen({ route }) {
  const { pairId, pairDetails } = route.params;
  const [chatMessages, setchatMessages] = useState();
  let mentorId, menteeId;

  useEffect(() => {
    getChat();
  }, []);

  const getChat = async () => {
    const response = await pairApi.getPairChat(pairId);
    if (response.ok) {
      return setchatMessages(response.data);
    }
    return null;
  };

  if (pairDetails) {
    if (pairDetails[0].role === "mentor") {
      mentorId = pairDetails[0]._id;
      menteeId = pairDetails[1]._id;
    }
    mentorId = pairDetails[1]._id;
    mentorId = pairDetails[0]._id;
  }

  return (
    <Screen>
      <View style={style.container}>
        <View style={style.heading}>
          <Text style={style.headingText}>MENTEE</Text>
          <Text style={style.headingText}>MENTOR</Text>
        </View>
        <View style={style.chats}>
          <FlatList
            data={chatMessages}
            inverted={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={style.chatList}>
                {item.userId === mentorId ? (
                  <View style={style.messageOut}>
                    <Text style={{ color: "white" }}>{item.message}</Text>
                    <Text style={style.chatTimeOut}>
                      {new Date(item.time).toLocaleTimeString().slice(0, 5)}
                    </Text>
                  </View>
                ) : (
                  <View style={style.messageIn}>
                    <Text style={{ color: "white" }}>{item.message}</Text>
                    <Text style={style.chatTimeIn}>
                      {new Date(item.time).toLocaleTimeString().slice(0, 5)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </Screen>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  headingText: {
    fontSize: 18,
  },
  chats: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  chatTimeIn: {
    fontSize: 10,
    textAlign: "right",
    color: "#c9c8b9",
  },
  chatTimeOut: {
    fontSize: 10,
    textAlign: "right",
    color: "#6f7275",
  },
  messageOut: {
    maxWidth: "70%",
    backgroundColor: "#6bd3f2",
    borderRadius: 15,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 5,
  },
  messageIn: {
    maxWidth: "70%",
    backgroundColor: "#723da6",
    borderRadius: 15,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 5,
  },
});

export default ChatScreen;
