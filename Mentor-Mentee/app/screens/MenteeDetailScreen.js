import React, { useState, useEffect } from "react";
import Screen from "../components/Screen";
import {
  Text,
  View,
  StyleSheet,
  Image as ImageLocal,
  ScrollView,
} from "react-native";
import OfflineNotice from "../components/offlineNotice";
import pairApi from "../api/pair";
import { Image } from "react-native-expo-image-cache";

const nullUserData = {
  fullName: "",
  gender: "Male",
  phoneNo: "",
  dob: "",
  streetAddress: "",
  city: "",
  state: "",
  country: "",
  achievements: "",
  email: "",
  pinCode: "",
};

function MenteeDetailScreen() {
  const [userData, setUserData] = useState(nullUserData);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    const response = await pairApi.getPairDetails();
    if (!response.ok) return null;
    setUserData(response.data);
  };

  return (
    <Screen>
      <OfflineNotice />
      <ScrollView>
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
            ></Text>
          </View>
        </View>
        <View style={style.accountDetails}>
          <View style={style.labelItems}>
            <Text style={style.label}>Full Name : </Text>
            <Text style={style.label}>Gender : </Text>
            <Text style={style.label}>Phone Number : </Text>
            <Text style={style.label}>Email : </Text>
            <Text style={style.label}>Date of Birth : </Text>
            {userData.class ? <Text style={style.label}>Class : </Text> : null}
            <Text style={style.label}>Street Address : </Text>
            <Text style={style.label}>City : </Text>
            <Text style={style.label}>State : </Text>
            <Text style={style.label}>Country Name : </Text>
            <Text style={style.label}>Pin Code : </Text>
            {userData.qualifications ? (
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
              {userData.class ? (
                <Text style={style.value}>{userData.class}</Text>
              ) : null}
              <Text style={style.value}>{userData.streetAddress}</Text>
              <Text style={style.value}>{userData.city}</Text>
              <Text style={style.value}>{userData.state}</Text>
              <Text style={style.value}>{userData.country}</Text>
              <Text style={style.value}>{userData.pinCode}</Text>
              {userData.qualifications ? (
                <Text style={style.value}>{userData.qualifications}</Text>
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
export default MenteeDetailScreen;
