import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import OfflineNotice from "../components/offlineNotice";
import Screen from "../components/Screen";
import pairApi from "../api/pair";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function MentorDashboardScreen({ route, navigation }) {
  const { pairId } = route.params;
  const [loader, setLoader] = useState(true);
  const [pairDetails, setPairDetails] = useState();
  const [userDetails, setUserDetails] = useState();
  const [pairReports, setPairReports] = useState();
  const [pairPlans, setPairPlans] = useState();
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    setLoader(true);
    const response = await pairApi.getPairDetails(pairId);
    setLoader(false);
    if (response.ok) return setPairDetails(response.data);
    return null;
  };

  const loadUserDetails = async () => {
    if (!userDetails) {
      let mentorId, menteeId;
      if (pairDetails[0].role === "mentor") {
        menteeId = pairDetails[1].userDetails;
        mentorId = pairDetails[0].userDetails;
      }
      menteeId = pairDetails[0].userDetails;
      mentorId = pairDetails[1].userDetails;
      setLoader(true);
      const response = await pairApi.getPairUserDetails(mentorId, menteeId);
      setLoader(false);
      if (response.ok) return setUserDetails(response.data);
      return null;
    }
    return null;
  };

  const loadPairReports = async () => {
    if (!pairReports) {
      let mentorId, menteeId;
      if (pairDetails[0].role === "mentor") {
        menteeId = pairDetails[1]._id;
        mentorId = pairDetails[0]._id;
      }
      menteeId = pairDetails[0]._id;
      mentorId = pairDetails[1]._id;
      setLoader(true);
      const response = await pairApi.getPairReports(mentorId, menteeId);
      setLoader(false);
      if (response.ok) {
        return setPairReports(response.data);
      }
      return null;
    }
    return null;
  };

  const loadPairPlans = async () => {
    if (!pairPlans) {
      let pairId = pairDetails[1].pairId;
      setLoader(true);
      const response = await pairApi.getPairPlans(pairId);
      setLoader(false);
      if (response.ok) {
        setPairPlans(response.data);
      }
      return null;
    }
    return null;
  };

  return (
    <Screen>
      {loader ? (
        <>
          <Modal transparent={true} animationType={"none"} visible={loader}>
            <View style={style.container}>
              <ActivityIndicator animating={loader} size="large" color="#000" />
            </View>
          </Modal>
        </>
      ) : null}
      <OfflineNotice />
      <ScrollView>
        <View>
          {pairDetails ? (
            <View>
              <View style={style.heading}>
                <Text style={style.headingText}>
                  Mentor : {pairDetails[0].username}
                </Text>
                <Text style={style.headingText}>
                  Mentee : {pairDetails[1].username}
                </Text>
              </View>
              <View style={style.content}>
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      loadUserDetails();
                      setExpanded1(!expanded1);
                    }}
                  >
                    <View style={style.contentHeading}>
                      <Text style={{ fontSize: 16 }}>UserDetails</Text>
                      <MaterialCommunityIcons
                        size={24}
                        name={
                          expanded1
                            ? "arrow-down-bold-circle"
                            : "arrow-up-bold-circle"
                        }
                      />
                    </View>
                  </TouchableOpacity>
                  <View>
                    {expanded1 ? (
                      userDetails ? (
                        <View style={style.contentDetails}>
                          <View>
                            <View>
                              <Text
                                style={{ fontSize: 18, textAlign: "center" }}
                              >
                                Mentor
                              </Text>
                              <Text>
                                Name : {userDetails.mentorDetails.fullName}
                              </Text>
                              <Text>
                                Gender : {userDetails.mentorDetails.gender}
                              </Text>
                              <Text>
                                Phone No. : {userDetails.mentorDetails.phoneNo}
                              </Text>
                              <Text>
                                Email : {userDetails.mentorDetails.email}
                              </Text>
                              <Text>
                                Date of Birth :
                                {new Date(
                                  userDetails.mentorDetails.dob
                                ).toLocaleDateString()}
                              </Text>
                              <Text>
                                Address :
                                {userDetails.mentorDetails.streetAddress},
                                {userDetails.mentorDetails.city}
                              </Text>
                              <Text>
                                City : {userDetails.mentorDetails.city}
                              </Text>
                              <Text>
                                State : {userDetails.mentorDetails.state}
                              </Text>
                              <Text>
                                Country : {userDetails.mentorDetails.country}
                              </Text>
                              <Text>
                                Achievements :
                                {userDetails.mentorDetails.achievements}
                              </Text>
                              <Text>
                                Qualifications :
                                {userDetails.mentorDetails.qualifications}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{ fontSize: 18, textAlign: "center" }}
                              >
                                Mentee
                              </Text>
                              <Text>
                                Name : {userDetails.menteeDetails.fullName}
                              </Text>
                              <Text>
                                Gender : {userDetails.menteeDetails.gender}
                              </Text>
                              <Text>
                                Class : {userDetails.menteeDetails.class}
                              </Text>
                              <Text>
                                Phone No. : {userDetails.menteeDetails.phoneNo}
                              </Text>
                              <Text>
                                Date of Birth :
                                {new Date(
                                  userDetails.menteeDetails.dob
                                ).toLocaleDateString()}
                              </Text>
                              <Text>
                                Address :
                                {userDetails.menteeDetails.streetAddress},
                                {userDetails.menteeDetails.city}
                              </Text>
                              <Text>
                                City : {userDetails.menteeDetails.city}
                              </Text>
                              <Text>
                                State : {userDetails.menteeDetails.state}
                              </Text>
                              <Text>
                                Country : {userDetails.menteeDetails.country}
                              </Text>
                              <Text>
                                Achievements :
                                {userDetails.menteeDetails.achievements}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={style.contentDetails}>
                          <Text>Data Not Found</Text>
                        </View>
                      )
                    ) : null}
                  </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      loadPairReports();
                      setExpanded2(!expanded2);
                    }}
                  >
                    <View style={style.contentHeading}>
                      <Text style={{ fontSize: 16 }}>Reports</Text>
                      <MaterialCommunityIcons
                        size={24}
                        name={
                          expanded2
                            ? "arrow-down-bold-circle"
                            : "arrow-up-bold-circle"
                        }
                      />
                    </View>
                  </TouchableOpacity>
                  {expanded2 ? (
                    pairReports ? (
                      <View style={style.contentDetails}>
                        <View>
                          <Text style={{ fontWeight: "700" }}>
                            Mentor Reports :{" "}
                          </Text>
                          {pairReports.mentorAllReports
                            .reverse()
                            .map((item, index) => (
                              <View key={index}>
                                <View style={{ marginVertical: 5 }}>
                                  <Text>
                                    {new Date(item.date).toLocaleDateString()} :
                                    {new Date(item.date)
                                      .toLocaleTimeString()
                                      .slice(0, 5)}
                                  </Text>
                                  <Text>{item.description}</Text>
                                </View>
                              </View>
                            ))}
                          <Text style={{ marginTop: 10, fontWeight: "700" }}>
                            Mentor Reports :
                          </Text>
                          {pairReports.menteeAllReports
                            .reverse()
                            .map((item, index) => (
                              <View key={index}>
                                <View style={{ marginVertical: 5 }}>
                                  <Text>
                                    {new Date(item.date).toLocaleDateString()} :
                                    {new Date(item.date)
                                      .toLocaleTimeString()
                                      .slice(0, 5)}
                                  </Text>
                                  <Text>{item.description}</Text>
                                </View>
                              </View>
                            ))}
                        </View>
                      </View>
                    ) : (
                      <View style={style.contentDetails}>
                        <Text>Data Not Found</Text>
                      </View>
                    )
                  ) : null}
                </View>
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      loadPairPlans();
                      setExpanded3(!expanded3);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={style.contentHeading}>
                      <Text style={{ fontSize: 16 }}>Plans</Text>
                      <MaterialCommunityIcons
                        size={24}
                        name={
                          expanded3
                            ? "arrow-down-bold-circle"
                            : "arrow-up-bold-circle"
                        }
                      />
                    </View>
                  </TouchableOpacity>
                  {expanded3 ? (
                    pairPlans ? (
                      <View style={style.contentDetails}>
                        <View>
                          {pairPlans.map((item, index) => (
                            <View key={index} style={{ marginVertical: 5 }}>
                              <Text>
                                {new Date(item.date).toLocaleDateString()} :
                                {new Date(item.date)
                                  .toLocaleTimeString()
                                  .slice(0, 5)}
                              </Text>
                              <Text>{item.description}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <View style={style.contentDetails}>
                        <View>
                          <Text>Data Not Found</Text>
                        </View>
                      </View>
                    )
                  ) : null}
                </View>
                <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Chat", {
                        pairId: pairDetails[0].pairId,
                        pairDetails: pairDetails,
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <View style={style.contentHeading}>
                      <Text style={{ fontSize: 16 }}>Chats</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
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
    opacity: 0.5,
    backgroundColor: "#CCCCCC",
    height: Dimensions.get("window").height,
    width: "100%",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#5c88a3",
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  headingText: {
    fontSize: 18,
    color: "#fff",
  },
  contentHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#dddddd",
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  contentDetails: {
    marginTop: 1,
    flexDirection: "column",
    marginHorizontal: 10,
    backgroundColor: "#eeeeee",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default MentorDashboardScreen;
