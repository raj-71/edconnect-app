import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image as ImageLocal,
} from "react-native";
import Screen from "../components/Screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import mentorAccountApi from "../api/mentorAccount";
import { Image } from "react-native-expo-image-cache";
import OfflineNotice from "../components/offlineNotice";
import cache from "../utility/cache";

const nullUserData = {
  fullName: "",
  gender: "Male",
  phoneNo: "",
  dob: Date.now(),
  streetAddress: "",
  city: "",
  state: "",
  country: "",
  achievements: "",
  email: "",
  pinCode: "",
};

function MentorAccountScreen({ route, navigation, props }) {
  const { user, setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(nullUserData);

  useEffect(() => {
    loadDetails();
  }, [route.params]);

  const loadDetails = async () => {
    const response = await mentorAccountApi.getDetails();
    if (!response.ok) return null;
    setUserData(response.data);
    return;
  };

  const handleLogout = () => {
    setUser(null);
    authStorage.removeToken();
    cache.clearAll();
  };

  return (
    <Screen>
      <OfflineNotice />
      <ScrollView>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <MaterialCommunityIcons
            name="account-edit"
            size={35}
            style={{
              marginLeft: 25,
            }}
            onPress={() =>
              navigation.navigate("Edit Profile", { userData: userData })
            }
          />
          <MaterialCommunityIcons
            name="logout"
            style={{
              marginRight: 25,
            }}
            size={35}
            onPress={handleLogout}
          />
        </View>
        <View style={style.profileImageView}>
          <View style={style.outer}>
            {typeof userData !== "undefined" ? (
              typeof userData.profileUrl !== "undefined" ? (
                <Image uri={userData.profileUrl} style={style.profileImage} />
              ) : (
                <ImageLocal
                  source={require("../assets/userImage.jpg")}
                  style={style.profileImage}
                />
              )
            ) : (
              <ImageLocal
                source={require("../assets/userImage.jpg")}
                style={style.profileImage}
              />
            )}

            <Text
              style={{ textAlign: "center", fontSize: 18, fontWeight: "700" }}
            >
              {user.username}
            </Text>
          </View>
        </View>
        <View style={style.accountDetails}>
          <View style={style.labelItems}>
            <Text style={style.label}>Full Name : </Text>
            <Text style={style.label}>Gender : </Text>
            <Text style={style.label}>Phone Number : </Text>
            <Text style={style.label}>Email : </Text>
            <Text style={style.label}>Date of Birth : </Text>
            {user.role === "mentee" ? (
              <Text style={style.label}>Class : </Text>
            ) : null}
            <Text style={style.label}>Street Address : </Text>
            <Text style={style.label}>City : </Text>
            <Text style={style.label}>State : </Text>
            <Text style={style.label}>Country Name : </Text>
            <Text style={style.label}>Pin Code : </Text>
            {user.role === "mentor" ? (
              <Text style={style.label}>Qualifications : </Text>
            ) : null}

            <Text style={style.label}>Achievements : </Text>
          </View>
          {userData ? (
            <View style={style.valueItems}>
              <Text style={style.value}>{userData.fullName}</Text>
              <Text style={style.value}>{userData.gender}</Text>
              <Text style={style.value}>{userData.phoneNo}</Text>
              <Text style={style.value}>{userData.email}</Text>
              <Text style={style.value}>
                {new Date(userData.dob).toDateString()}
              </Text>
              {user.role === "mentee" ? (
                <Text style={style.value}>
                  {userData.class ? userData.class : ""}
                </Text>
              ) : null}
              <Text style={style.value}>{userData.streetAddress}</Text>
              <Text style={style.value}>{userData.city}</Text>
              <Text style={style.value}>{userData.state}</Text>
              <Text style={style.value}>{userData.country}</Text>
              <Text style={style.value}>{userData.pinCode}</Text>
              {user.role === "mentor" ? (
                <Text style={style.value}>
                  {userData.qualifications ? userData.qualifications : ""}
                </Text>
              ) : null}
              <Text style={style.value}>
                {userData.achievements ? userData.achievements : ""}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const style = StyleSheet.create({
  accountDetails: {
    marginTop: 20,
    marginBottom: 40,
    flexDirection: "row",
  },
  labelItems: {
    flexDirection: "column",
    marginLeft: 20,
  },
  valueItems: {
    flexDirection: "column",
  },
  value: {
    width: "100%",
    marginVertical: 10,
    fontSize: 18,
    marginLeft: 10,
  },
  label: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "700",
  },
  profileImageView: {
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
  outer: {
    position: "relative",
  },
});

export default MentorAccountScreen;
