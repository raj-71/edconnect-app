import AsyncStorage from "@react-native-community/async-storage";
import Bugsnag from "@bugsnag/expo";

const prefix = "cache";

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(value));
  } catch (error) {
    Bugsnag.notify(new Error(error));
  }
};

const get = async (key) => {
  try {
    let value = await AsyncStorage.getItem(prefix + key);
    value = JSON.parse(value);

    if (!value) return null;
    return value;
  } catch (error) {
    Bugsnag.notify(new Error(error));
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    Bugsnag.notify(new Error(error));
  }
};

export default {
  store,
  get,
  clearAll,
};
