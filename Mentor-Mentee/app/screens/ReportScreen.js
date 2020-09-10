import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, TextInput } from "react-native";
import Screen from "../components/Screen";
import reportApi from "../api/report";
import OfflineNotice from "../components/offlineNotice";
import { TouchableOpacity } from "react-native-gesture-handler";

function ReportScreen() {
  const [text, setText] = useState();
  const [reports, setReports] = useState();
  const [msg, setMsg] = useState();
  const [error, setError] = useState();

  const loadReports = async () => {
    const response = await reportApi.getReports();
    if (!response.ok) return null;
    const data = response.data.reverse();
    setReports(data);
    return;
  };

  useEffect(() => {
    loadReports();
  }, []);

  const submitReport = async () => {
    let reportText = text;
    setText("");
    setMsg("");
    setError("");
    const date = Date.now();
    const response = await reportApi.putReports(date, reportText);
    if (!response.ok) return setError(`Some Error Occurred!`);
    loadReports();
    setMsg("Submitted Successfully");
  };

  return (
    <Screen>
      <OfflineNotice />
      <View>
        <Text style={style.heading}> Send Report/Query to Admin</Text>
        <TextInput
          multiline
          numberOfLines={5}
          value={text}
          style={style.ReportInputBox}
          onChangeText={(text) => setText(text)}
          autoGrow={false}
          placeholder={"Enter Your Query/Report here"}
          placeholderTextColor={"black"}
        />
        {msg ? (
          <Text style={{ marginLeft: 20, color: "green", marginTop: 15 }}>
            {msg}
          </Text>
        ) : null}
        {error ? (
          <Text style={{ marginLeft: 20, color: "red", marginTop: 15 }}>
            {error}
          </Text>
        ) : null}
        <TouchableOpacity>
          <Text style={style.submitButton} onPress={() => submitReport()}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={style.recentListHeading}>Recent Reports/Queries</Text>
        <View style={style.schedulesList}>
          <FlatList
            style={{ marginBottom: 45 }}
            data={reports}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={style.singlePlan}>
                <Text style={style.singlePlanDate}>
                  {new Date(item.date).toLocaleDateString()}&ensp;
                  {new Date(item.date).toLocaleTimeString().slice(0, 5)}
                </Text>
                <Text style={style.singlePlanDescriptionHeading}>
                  Description:
                </Text>
                <Text style={style.singlePlanDescription}>
                  {item.description}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </Screen>
  );
}

const style = StyleSheet.create({
  recentListHeading: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 10,
  },
  ReportInputBox: {
    fontSize: 14,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 5,
    borderRadius: 10,
    textAlignVertical: "top",
    padding: 5,
  },
  submitButton: {
    backgroundColor: "#084a8c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 10,
    color: "white",
    fontWeight: "bold",
  },
  singlePlan: {
    marginHorizontal: 20,
    backgroundColor: "#ebebeb",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  singlePlanDate: {
    fontWeight: "700",
    fontSize: 18,
  },
  singlePlanDescriptionHeading: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ReportScreen;
