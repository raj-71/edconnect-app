import AsyncStorage from "@react-native-community/async-storage";

const prefix = "cache";

const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

const get = async (key) => {
  try {
    let value = await AsyncStorage.getItem(prefix + key);
    value = JSON.parse(value);

    if (!value) return null;
    return value;
  } catch (error) {
    console.log(error);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
  console.log("Done.");
};

export default {
  store,
  get,
  clearAll,
};
