import React, { useState, useEffect } from "react";
import Screen from "../components/Screen";
import { View, Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import OfflineNotice from "../components/offlineNotice";
import ErrorMessage from "../components/forms/ErrorMessage";
import TextInput from "../components/TextInput";
import AppButton from "../components/Button";
import registerAdminApi from "../api/registerAdmin";

const validationSchema = Yup.object().shape({
  adminUser: Yup.string().required().min(3).label("Admin Username"),
  adminPass: Yup.string().required().min(6).label("Admin Password"),
});

function RegisterAdmin(props) {
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
  }, [tempData]);

  const handleSubmit = async ({ adminUser, adminPass }) => {
    let temp = {
      adminUser: adminUser,
      adminPass: adminPass,
    };
    setSignupFailed(false);
    setUsernameError(false);
    setResult("Submitting...");
    const response = await registerAdminApi.postAdminRegister(
      adminUser,
      adminPass
    );
    if (response.status === 400 && !response.ok) {
      setResult("");
      temp = {};
      return setUsernameError(response.data);
    }
    if (response.ok) {
      setTempData(temp);
      return setResult("Registered Successfully");
    }
    if (!response.ok) {
      temp = {};
      setSignupFailed(true);
    }
  };

  return (
    <Screen>
      <OfflineNotice />
      <View style={style.createPairScreen}>
        <Formik
          initialValues={{
            adminUser: "",
            adminPass: "",
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
                  <Text style={style.heading}>Register New Admin</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="account"
                    onBlur={() => setFieldTouched("adminUser")}
                    onChangeText={handleChange("adminUser")}
                    placeholder="Admin Username"
                  />
                  <ErrorMessage
                    error={errors["adminUser"]}
                    visible={touched["adminUser"]}
                  />
                  {usernameError && (
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        fontSize: 18,
                      }}
                    >
                      {usernameError}
                    </Text>
                  )}
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="lock"
                    onBlur={() => setFieldTouched("adminPass")}
                    onChangeText={handleChange("adminPass")}
                    placeholder="Admin Password"
                    secureTextEntry
                    textContentType="password"
                  />
                  <ErrorMessage
                    error={errors["adminPass"]}
                    visible={touched["adminPass"]}
                  />
                  <ErrorMessage
                    error="Resgistration Failed!"
                    visible={signupFailed}
                  />
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
        <View style={{ marginBottom: 100 }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Screenshot this or copy somewhere because this will remove after
            15seconds and password cannot be changed later.
          </Text>
          <View style={{ marginVertical: 10, marginHorizontal: 40 }}>
            <Text style={style.resultHeading}>Admin :</Text>
            <Text style={style.result}>Username : {tempData.adminUser}</Text>
            <Text style={style.result}>Password : {tempData.adminPass}</Text>
          </View>
        </View>
      ) : null}
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
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  resultHeading: {
    fontSize: 16,
    fontWeight: "700",
  },
  resultHeading: {
    fontSize: 16,
  },
});

export default RegisterAdmin;
