import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";
import Bugsnag from "@bugsnag/expo";

const key = "authToken";

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    Bugsnag.notify(new Error("Error storing the auth token", error));
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    Bugsnag.notify(new Error("Error getting the auth token", error));
  }
};

const getUser = async () => {
  const token = await getToken();
  return token ? jwtDecode(token) : null;
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    Bugsnag.notify(new Error("Error removing the auth token", error));
  }
};

export default { getToken, getUser, removeToken, storeToken };
