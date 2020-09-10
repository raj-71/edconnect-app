import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
} from "react-native";
import Screen from "../components/Screen";
import AppButton from "../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import authApi from "../api/auth";
import ErrorMessage from "../components/forms/ErrorMessage";
import jwtDecode from "jwt-decode";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import OfflineNotice from "../components/offlineNotice";
import TextInput from "../components/TextInput";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().min(3).label("Username"),
  password: Yup.string().required().min(6).label("Password"),
});

function LoginScreen(props) {
  const authContext = useContext(AuthContext);
  const [loginFailed, setLoginFailed] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);
  const handleSubmit = async ({ username, password }) => {
    setLoginLoader(true);
    const result = await authApi.login(username, password);
    setLoginLoader(false);
    if (!result.ok) return setLoginFailed(true);
    setLoginFailed(false);
    const user = jwtDecode(result.data);
    authContext.setUser(user);
    authStorage.storeToken(result.data);
  };

  return (
    <>
      {loginLoader ? (
        <>
          <Modal
            transparent={true}
            animationType={"none"}
            visible={loginLoader}
          >
            <View style={styles.container}>
              <ActivityIndicator
                animating={loginLoader}
                size="large"
                color="#000"
              />
            </View>
          </Modal>
        </>
      ) : null}
      <Screen>
        <OfflineNotice />
        <View style={{ top: 70 }}>
          <Image style={styles.logo} source={require("../assets/icon.png")} />
          <Text style={{ textAlign: "center", fontSize: 24, marginTop: 8 }}>
            EdConnect
          </Text>
        </View>
        <Formik
          initialValues={{ username: "", password: "" }}
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
              <Screen style={styles.loginScreen}>
                <TextInput
                  icon="account"
                  onBlur={() => setFieldTouched("username")}
                  onChangeText={handleChange("username")}
                  autoCapitalize="none"
                  placeholder="Username"
                  autoCorrect={false}
                />
                <ErrorMessage
                  error={errors["username"]}
                  visible={touched["username"]}
                />
                <TextInput
                  icon="lock"
                  onBlur={() => setFieldTouched("password")}
                  onChangeText={handleChange("password")}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Password"
                  secureTextEntry
                  textContentType="password"
                />
                <ErrorMessage
                  error={errors["password"]}
                  visible={touched["password"]}
                />
                <ErrorMessage
                  error="Invalid username or password"
                  visible={loginFailed}
                />
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <AppButton title="Login" onPress={handleSubmit} />
                </View>
              </Screen>
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  loginScreen: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },
  logo: {
    height: 70,
    width: 150,
    alignSelf: "center",
  },
  container: {
    position: "absolute",
    backgroundColor: "#bfbfbf",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
    backgroundColor: "#CCCCCC",
    height: Dimensions.get("window").height,
    width: "100%",
  },
});

export default LoginScreen;
