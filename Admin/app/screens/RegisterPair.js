import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import OfflineNotice from "../components/offlineNotice";
import cache from "../utility/cache";
import { Formik } from "formik";
import AppFormField from "../components/forms/FormField";
import * as Yup from "yup";
import ErrorMessage from "../components/forms/ErrorMessage";
import AppButton from "../components/Button";
import registerPairApi from "../api/registerPair";
import TextInput from "../components/TextInput";

const validationSchema = Yup.object().shape({
  mentorUser: Yup.string().required().min(3).label("Mentor Username"),
  mentorPass: Yup.string().required().min(6).label("Mentor Password"),
  menteeUser: Yup.string().required().min(3).label("Mentee Username"),
  menteePass: Yup.string().required().min(6).label("Mentee Password"),
});

function RegisterPair(props) {
  const { setUser } = useContext(AuthContext);
  const [signupFailed, setSignupFailed] = useState(false);
  const [tempData, setTempData] = useState();
  const [result, setResult] = useState("");
  const [reload, setReload] = useState(false);
  const [usernameError, setUsernameError] = useState();

  useEffect(() => {
    setTimeout(() => {
      setTempData();
      setResult("");
      setReload(false);
    }, 15000);
  }, [reload]);

  const handleLogout = () => {
    setUser(null);
    authStorage.removeToken();
    cache.clearAll();
  };

  const handleSubmit = async (data) => {
    setSignupFailed(false);
    setResult("Submitting...");
    const response = await registerPairApi.postPair(data);
    if (response.status === 404) {
      setResult("");
      setTempData();
      return setUsernameError(response.data);
    }
    if (!response.ok) {
      setUsernameError("");
      setTempData();
      setResult("");
      return setSignupFailed(true);
    }
    setUsernameError("");
    setResult("Pairs Registered Successfully");
    setTempData(data);
    setReload(true);
  };

  return (
    <Screen>
      <OfflineNotice />
      <ScrollView>
        <View
          style={{
            flexDirection: "row-reverse",
            flex: 1,
            marginVertical: 15,
          }}
        >
          <View>
            <MaterialCommunityIcons
              name="logout"
              style={{
                marginRight: 25,
              }}
              size={35}
              onPress={handleLogout}
            />
            <Text style={{ marginRight: 15 }}>Logout</Text>
          </View>
        </View>
        <View style={style.createPairScreen}>
          <Formik
            initialValues={{
              mentorUser: "",
              mentorPass: "",
              menteeUser: "",
              menteePass: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <>
                <Screen style={style.loginScreen}>
                  <View>
                    <Text style={style.heading}>Mentor</Text>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon="account"
                      onBlur={() => setFieldTouched("mentorUser")}
                      onChangeText={handleChange("mentorUser")}
                      placeholder="Mentor Username"
                    />
                    <ErrorMessage
                      error={errors["mentorUser"]}
                      visible={touched["mentorUser"]}
                    />
                    <AppFormField
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon="lock"
                      name="mentorPass"
                      placeholder="Mentor Password"
                      secureTextEntry
                      textContentType="password"
                    />
                    <Text style={style.heading}>Mentee</Text>
                    <AppFormField
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon="account"
                      name="menteeUser"
                      placeholder="Mentee Username"
                    />
                    <AppFormField
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon="lock"
                      name="menteePass"
                      placeholder="Mentee Password"
                      secureTextEntry
                      textContentType="password"
                    />
                    <ErrorMessage
                      error="Resgistration Failed!"
                      visible={signupFailed}
                    />
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        fontSize: 18,
                      }}
                    >
                      {usernameError}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AppButton title="Create Pair" onPress={handleSubmit} />
                    <Text style={{ color: "green" }}>{result}</Text>
                  </View>
                </Screen>
              </>
            )}
          </Formik>
        </View>
        {tempData ? (
          <View>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              Screenshot this or copy somewhere because this will remove after
              15seconds and password cannot be changed later.
            </Text>
            <View style={{ marginVertical: 10, marginHorizontal: 40 }}>
              <Text style={style.resultHeading}>For Mentor :</Text>
              <Text style={style.result}>
                {tempData.mentorUser} : {tempData.mentorPass}
              </Text>
              <Text style={style.resultHeading}>For Mentee :</Text>
              <Text style={style.result}>
                {tempData.menteeUser} : {tempData.menteePass}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const style = StyleSheet.create({
  loginScreen: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
  createPairScreen: {
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  resultHeading: {
    fontSize: 16,
    fontWeight: "700",
  },
  resultHeading: {
    fontSize: 16,
  },
});

export default RegisterPair;
