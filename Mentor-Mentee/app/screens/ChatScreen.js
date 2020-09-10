import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import chatApi from "../api/chat";
import AuthContext from "../auth/context";
import Screen from "../components/Screen";
import Bugsnag from "@bugsnag/expo";

function ChatScreen() {
  const { user, messages } = useContext(AuthContext);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setchatMessages] = useState(messages || []);
  const [, setReRender] = useState();

  useEffect(() => {
    chatApi.subscribeToChat((err, data) => {
      if (err) return Bugsnag.notify(new Error("Could not join chat"));
      let newMessage = {
        message: data.msg,
        time: new Date(Date.now()),
        userId: data.userId,
      };
      updateMessage(newMessage);
    });
  }, []);

  const updateMessage = (msg) => {
    chatMessages.unshift(msg);
    setReRender({});
    return;
  };

  const sendMessage = () => {
    if (chatMessage === "") return null;
    let newMessage = {
      message: chatMessage,
      time: new Date(Date.now()),
      userId: user._id,
    };
    chatMessages.unshift(newMessage);
    chatApi.sendMessage(user.pairId, user._id, chatMessage);
    setChatMessage();
  };

  return (
    <Screen>
      <View style={style.headBanner}>
        {user.role === "mentor" ? (
          <Text style={style.bannerHeading}>Chat with Mentee</Text>
        ) : (
          <Text style={style.bannerHeading}>Chat with Mentor</Text>
        )}
      </View>
      <View style={style.container}>
        <View style={style.chats}>
          <FlatList
            data={chatMessages}
            inverted={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={style.chatList}>
                {item.userId === user._id ? (
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
        <View style={style.inputColumn}>
          <TextInput
            multiline
            style={style.chatBox}
            onChangeText={(text) => setChatMessage(text)}
            value={chatMessage}
            placeholder="Type a message"
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={style.sendMessageButton}
          >
            <Text style={style.chatSendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  headBanner: {
    height: 60,
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  bannerHeading: {
    fontSize: 22,
    color: "white",
  },
  chats: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 90,
    marginTop: 50,
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
  inputColumn: {
    position: "absolute",
    justifyContent: "space-evenly",
    flexDirection: "row",
    width: "100%",
    bottom: 30,
  },
  chatBox: {
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 50,
    width: "78%",
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chatSendText: {
    fontSize: 16,
    color: "#fff",
  },
  sendMessageButton: {
    width: "18%",
    backgroundColor: "#e05b0d",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
});

export default ChatScreen;
