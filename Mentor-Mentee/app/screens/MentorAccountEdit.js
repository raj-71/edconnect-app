import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  Picker,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Screen from "../components/Screen";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import AppButton from "../components/Button";
import defaultStyles from "../config/styles";
import mentorAccountApi from "../api/mentorAccount";
import OfflineNotice from "../components/offlineNotice";
import AuthContext from "../auth/context";

const validationSchema = Yup.object().shape({
  gender: Yup.string().required().label("Gender"),
  fullName: Yup.string().required().min(3).label("Full Name"),
  phoneNo: Yup.number().required().positive().label("Phone Number"),
  email: Yup.string().email().required().label("Email"),
  dob: Yup.date().required().label("Date of Birth"),
  streetAddress: Yup.string().required().label("Street Address"),
  city: Yup.string().required().label("City"),
  state: Yup.string().required().label("State"),
  country: Yup.string().required().label("Country"),
  pinCode: Yup.number().required().label("Pin Code"),
  achievements: Yup.string().required().label("Achievements"),
  class: Yup.number().max(12).label("Class"),
});

function MentorAccountEdit({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const { userData } = route.params;
  delete userData._id;
  delete userData.__v;
  delete userData.userId;
  const [imageUri, setImageUri] = useState(
    userData.profileUrl ? userData.profileUrl : undefined
  );
  const [gender, setGender] = useState(userData ? userData.gender : "");
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [submitLoader, setSubmitLoader] = useState(false);
  const [dob, setDob] = useState(
    userData ? new Date(userData.dob) : new Date.now()
  );
  const [submitFailed, setSubmitFailed] = useState(false);
  const [profileUploadFailed, setProfileUploadFailed] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (!result.granted)
      alert("You need to enable permission to access images");
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) setImageUri(result.uri);
    } catch (error) {
      Alert.alert(
        `Error occurred in selecting an image. Please restart the app.`
      );
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShow(Platform.OS === "ios");
    setDob(currentDate);
    return currentDate;
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = async () => {
    showMode("date");
  };

  const handleSubmit = async (data) => {
    setProfileUploadFailed(false);
    setSubmitFailed(false);
    setSubmitLoader(true);
    if (imageUri) {
      const profileResponse = await mentorAccountApi.putImage(imageUri);
      if (!profileResponse) return setProfileUploadFailed(true);
      data["profileUrl"] = profileResponse.data.imageUrl;
    }

    const response = await mentorAccountApi.putDetails(data);
    setSubmitLoader(false);
    if (!response.ok) {
      return setSubmitFailed(true);
    }
    setSubmitFailed(false);
    setProfileUploadFailed(false);
    navigation.navigate("Account", { reloadScreen: true });
  };

  function ErrorMessage({ error, visible }) {
    if (!visible || !error) return null;

    return <Text style={style.error}>{error}</Text>;
  }

  return (
    <Screen>
      <OfflineNotice />
      {submitLoader ? (
        <>
          <Modal
            transparent={true}
            animationType={"none"}
            visible={submitLoader}
          >
            <View style={style.container}>
              <ActivityIndicator
                animating={submitLoader}
                size="large"
                color="#000"
              />
            </View>
          </Modal>
        </>
      ) : null}
      <ScrollView>
        <View>
          <View style={style.profileImageView}>
            <View style={style.outer}>
              {typeof userData !== "undefined" || imageUri ? (
                typeof userData.profileUrl !== "undefined" || imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={style.profileImage}
                  />
                ) : (
                  <Image
                    source={require("../assets/userImage.jpg")}
                    style={style.profileImage}
                  />
                )
              ) : (
                <Image
                  source={require("../assets/userImage.jpg")}
                  style={style.profileImage}
                />
              )}
              <View style={style.inner}>
                <MaterialCommunityIcons
                  onPress={selectImage}
                  name="camera"
                  size={20}
                />
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 40 }}>
            <Formik
              initialValues={userData}
              onSubmit={(data) => handleSubmit(data)}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                handleSubmit,
                setFieldValue,
                errors,
                touched,
              }) => (
                <>
                  <View style={style.infoInput}>
                    <MaterialCommunityIcons
                      name="account-box"
                      size={30}
                      style={style.inputIcon}
                    />
                    <Picker
                      onValueChange={(item) => {
                        setGender(item);
                        setFieldValue("gender", item);
                      }}
                      selectedValue={gender}
                      style={style.inputBox}
                    >
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                    </Picker>
                  </View>

                  <View style={style.infoInput}>
                    <MaterialCommunityIcons
                      name="shield-account"
                      size={30}
                      style={style.inputIcon}
                    />
                    <TextInput
                      onChangeText={handleChange("fullName")}
                      style={style.inputBox}
                      placeholder="Full Name"
                      defaultValue={userData.fullName}
                    />
                  </View>
                  <ErrorMessage
                    error={errors["fullName"]}
                    visible={touched["fullName"]}
                  />
                  {user.role === "mentee" ? (
                    <>
                      <View style={style.infoInput}>
                        <MaterialCommunityIcons
                          name="book-open-variant"
                          size={30}
                          style={style.inputIcon}
                        />
                        <TextInput
                          onChangeText={handleChange("class")}
                          style={style.inputBox}
                          placeholder="Class"
                          keyboardType="numeric"
                          defaultValue={userData.fullName}
                        />
                      </View>
                      <ErrorMessage
                        error={errors["class"]}
                        visible={touched["class"]}
                      />
                    </>
                  ) : null}

                  <View style={style.infoInput}>
                    <MaterialCommunityIcons
                      name="phone"
                      size={30}
                      style={style.inputIcon}
                    />
                    <TextInput
                      onChangeText={handleChange("phoneNo")}
                      style={style.inputBox}
                      placeholder="Phone Number"
                      keyboardType="numeric"
                      defaultValue={userData.phoneNo.toString()}
                    />
                  </View>
                  <ErrorMessage
                    error={errors["phoneNo"]}
                    visible={touched["phoneNo"]}
                  />
                  <View style={style.infoInput}>
                    <MaterialCommunityIcons
                      name="email"
                      size={30}
                      style={style.inputIcon}
                    />
                    <TextInput
                      onChangeText={handleChange("email")}
                      style={style.inputBox}
                      placeholder="Email"
                      keyboardType="email-address"
                      defaultValue={userData.email}
                    />
                  </View>
                  <ErrorMessage
                    error={errors["email"]}
                    visible={touched["email"]}
                  />
                  <View style={style.infoInput}>
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={dob}
                        mode={mode}
                        maximumDate={Date.now()}
                        is24Hour={false}
                        onChange={(event, selectedDate) => {
                          let changedDate = onChange(event, selectedDate);
                          setFieldValue("dob", changedDate);
                        }}
                      />
                    )}
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={30}
                      style={style.inputIcon}
                    />
                    <Text style={style.inputBox} onPress={showDatepicker}>
                      {dob ? (
                        <Text>{dob.toDateString()}</Text>
                      ) : (
                        <Text>Date of Birth</Text>
                      )}
                    </Text>
                  </View>
                  <ErrorMessage
                    error={errors["dob"]}
                    visible={touched["dob"]}
                  />
                  <View style={style.infoInput}>
                    <MaterialCommunityIcons
                      name="pin"
                      size={30}
                      style={style.inputIcon}
                    />
                    <TextInput
                      onChangeText={handleChange("streetAddress")}
                      style={style.inputBox}
                      placeholder="Street Address"
                      defaultValue={userData.streetAddress}
                    />
                  </View>
                  <ErrorMessage
                    error={errors["streetAddress"]}
                    visible={touched["streetAddress"]}
                  />
                  <View style={style.extraInput}>
                    <TextInput
                      onChangeText={handleChange("city")}
                      style={style.inputBox}
                      placeholder="City"
                      defaultValue={userData.city}
                    />
                    <TextInput
                      onChangeText={handleChange("state")}
                      style={style.inputBox}
                      placeholder="State"
                      defaultValue={userData.state}
                    />
                  </View>
                  <ErrorMessage
                    error={errors["state"]}
                    visible={touched["state"]}
                  />
                  <ErrorMessage
                    error={errors["city"]}
                    visible={touched["city"]}
                  />
                  <View style={style.extraInput}>
                    <TextInput
                      onChangeText={handleChange("country")}
                      style={style.inputBox}
                      placeholder="Country"
                      defaultValue={userData.country}
                    />
                    <TextInput
                      style={style.inputBox}
                      placeholder="Pin Code"
                      keyboardType="numeric"
                      onChangeText={handleChange("pinCode")}
                      defaultValue={userData.pinCode.toString()}
                    />
                  </View>
                  <ErrorMessage
                    error={errors["country"]}
                    visible={touched["country"]}
                  />
                  <ErrorMessage
                    error={errors["pinCode"]}
                    visible={touched["pinCode"]}
                  />
                  {user.role === "mentor" ? (
                    <>
                      <View style={style.infoInput}>
                        <MaterialCommunityIcons
                          name="school"
                          size={30}
                          style={style.inputIcon}
                        />
                        <TextInput
                          onChangeText={handleChange("qualifications")}
                          style={style.inputBox}
                          placeholder="Qualifications"
                          defaultValue={userData.qualifications}
                        />
                      </View>
                      <ErrorMessage
                        error={errors["qualifications"]}
                        visible={touched["qualifications"]}
                      />
                      <View style={style.extraInput}>
                        <TextInput
                          onChangeText={handleChange("achievements")}
                          style={style.inputBox}
                          placeholder="Achievements"
                          defaultValue={userData.achievements}
                        />
                      </View>
                      <ErrorMessage
                        error={errors["achievements"]}
                        visible={touched["achievements"]}
                      />
                    </>
                  ) : (
                    <>
                      <View style={style.infoInput}>
                        <MaterialCommunityIcons
                          name="school"
                          size={30}
                          style={style.inputIcon}
                        />
                        <TextInput
                          onChangeText={handleChange("achievements")}
                          style={style.inputBox}
                          placeholder="Achievements"
                          defaultValue={userData.achievements}
                        />
                      </View>
                      <ErrorMessage
                        error={errors["achievements"]}
                        visible={touched["achievements"]}
                      />
                    </>
                  )}

                  <ErrorMessage
                    error="Some Error occurred in submitting the form"
                    visible={submitFailed}
                  />
                  <ErrorMessage
                    error="Some Error occurred in uploading the profile image"
                    visible={profileUploadFailed}
                  />
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <AppButton title="Submit" onPress={handleSubmit} />
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const style = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#bfbfbf",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
    backgroundColor: "#CCCCCC",
    height: Dimensions.get("window").height,
    width: "100%",
  },
  error: {
    color: "red",
    marginLeft: 45,
    fontSize: 14,
  },
  loginScreen: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
  submitButtonBox: {
    backgroundColor: "#084a8c",
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 30,
  },
  submitButton: {
    marginHorizontal: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: "white",
  },
  genderPicker: {
    marginBottom: 25,
    margin: 20,
  },
  infoInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  extraInput: {
    flexDirection: "row",
    marginLeft: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  inputIcon: {
    padding: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  inputBox: {
    flex: 1,
    marginRight: 20,
    marginTop: 10,
    padding: 10,
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    color: "#424242",
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
  },
  profileImageView: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#e8ebe9",
  },
  inner: {
    backgroundColor: "#e3e2e1",
    width: 35,
    height: 35,
    borderRadius: 50,
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  outer: {
    position: "relative",
  },
});

export default MentorAccountEdit;
