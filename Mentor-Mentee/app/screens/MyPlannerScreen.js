import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import Screen from "../components/Screen";
import styles from "../config/styles";
import { StatusBar } from "expo-status-bar";
import MyPlannerApi from "../api/myplanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import ErrorMessage from "../components/forms/ErrorMessage";
import OfflineNotice from "../components/offlineNotice";
import AuthContext from "../auth/context";

function MyPlannerScreen() {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [description, onChangeText] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const response = await MyPlannerApi.getPlans();
    if (response.ok) {
      setPlans(response.data);
    }
  };

  const submitPlan = async () => {
    if (!description) return setDescriptionError(true);
    setDescriptionError(false);
    const response = await MyPlannerApi.putPlans(date, description);
    setModalVisible(!modalVisible);
    if (!response.ok) return null;
    loadPlans();
    return;
  };

  const deletePlan = async (id) => {
    const response = await MyPlannerApi.deletePlan(id);
    if (response.ok) loadPlans();
    return;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = async () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <Screen>
      <OfflineNotice />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : null}
        style={style.container}
      >
        <View>
          <StatusBar backgroundColor={"#f79257"} />
        </View>
        {/* plus button */}
        {user.role === "mentor" ? (
          <MaterialCommunityIcons
            style={style.openButton}
            name="plus-circle"
            size={60}
            color={styles.colors.primary}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        ) : null}

        {/* datetimepicker overlay */}
        <View style={style.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            {/* Modal View */}
            <View style={style.centeredView1}>
              <View style={style.modalView}>
                <View style={style.buttonpicker}>
                  <Text style={style.datepicker} onPress={showDatepicker}>
                    Select Date
                  </Text>
                  <Text style={style.datepicker} onPress={showTimepicker}>
                    Select Time
                  </Text>
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    minimumDate={Date.now()}
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                  />
                )}
                {date ? (
                  <View style={style.formatDateTime}>
                    <Text style={style.formatDate}>{date.toDateString()}</Text>
                    <Text style={style.formatTime}>
                      {date.toLocaleTimeString().slice(0, 5)}
                    </Text>
                  </View>
                ) : null}

                <ErrorMessage
                  error="Please enter description"
                  visible={descriptionError}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 30,
                    right: 10,
                    flexDirection: "row",
                  }}
                >
                  <TouchableHighlight
                    style={style.hideButton}
                    onPress={() => submitPlan()}
                  >
                    <Text style={style.textStyle}>Submit</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={style.hideButton}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={style.textStyle}>Cancel</Text>
                  </TouchableHighlight>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text>Description: </Text>
                  <TextInput
                    multiline
                    numberOfLines={3}
                    style={style.description}
                    onChangeText={(description) => onChangeText(description)}
                    autoGrow={false}
                    placeholder={"Enter the description here"}
                    placeholderTextColor={"black"}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View style={style.schedulesList}>
          <FlatList
            data={plans}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={style.singlePlan}>
                <View style={style.singlePlanDateView}>
                  <Text style={style.singlePlanDate}>
                    {new Date(item.date).toLocaleDateString()}&nbsp;
                    {new Date(item.date).toLocaleTimeString().slice(0, 5)}
                  </Text>
                  <MaterialCommunityIcons
                    name="delete"
                    color={"black"}
                    size={20}
                    onPress={() => deletePlan(item._id)}
                  />
                </View>
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
      </KeyboardAvoidingView>
    </Screen>
  );
}

const style = StyleSheet.create({
  singlePlanDate: {
    fontWeight: "700",
    fontSize: 18,
  },
  singlePlanDateView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  singlePlanTime: {},
  singlePlanDescription: {},
  singlePlanDescriptionHeading: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "700",
  },
  singlePlan: {
    marginHorizontal: 20,
    backgroundColor: "#ebebeb",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  schedulesList: {
    flex: 1,
    width: "100%",
    marginTop: 15,
  },
  description: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    width: 250,
    borderRadius: 10,
    textAlignVertical: "top",
    padding: 8,
  },
  container: {
    flex: 1,
  },
  datepicker: {
    backgroundColor: "#0068b3",
    borderRadius: 50,
    color: "white",
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  buttonpicker: {
    flexDirection: "row",
    padding: 10,
    width: "100%",
    justifyContent: "space-around",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },

  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    marginTop: 50,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "80%",
    height: 400,
  },
  openButton: {
    paddingLeft: 10,
    width: 80,
  },
  hideButton: {
    backgroundColor: "#084a8c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  formatDateTime: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  formatDate: {
    textAlign: "center",
    fontSize: 24,
  },
  formatTime: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "700",
  },
});

export default MyPlannerScreen;
