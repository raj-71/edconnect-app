import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
} from "react-native";
import OfflineNotice from "../components/offlineNotice";
import pairApi from "../api/pair";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import Bugsnag from "@bugsnag/expo";

function PairDetailScreen({ navigation }) {
  const [pairsList, setPairsList] = useState();
  const [loginLoader, setLoginLoader] = useState(false);

  useEffect(() => {
    loadPairs();
  }, []);

  const loadPairs = async () => {
    setLoginLoader(true);
    const response = await pairApi.getPair();
    setLoginLoader(false);
    if (response.ok) {
      return setPairsList(response.data);
    }
    return null;
  };

  const listHeader = () => {
    return (
      <View style={style.pairTableHeading}>
        <View style={style.mentorColHeading}>
          <View style={style.sno}>
            <Text style={style.headingText}>S.no.</Text>
          </View>
          <View style={style.mentorContent}>
            <Text style={style.headingText}>Mentor</Text>
          </View>
        </View>
        <View style={style.menteeColHeading}>
          <Text style={style.headingText}>Mentee</Text>
        </View>
      </View>
    );
  };
  return (
    <Screen>
      {loginLoader ? (
        <>
          <Modal
            transparent={true}
            animationType={"none"}
            visible={loginLoader}
          >
            <View style={style.container}>
              <ActivityIndicator
                animating={loginLoader}
                size="large"
                color="#000"
              />
            </View>
          </Modal>
        </>
      ) : null}
      <OfflineNotice />
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row-reverse",
          }}
        >
          <MaterialCommunityIcons
            name="reload"
            style={{
              marginRight: 25,
            }}
            size={35}
            onPress={() => loadPairs()}
          />
        </View>
        <Text style={style.heading}>Pairs List</Text>
        <View style={{ marginBottom: 80 }}>
          <FlatList
            data={pairsList}
            keyExtractor={(item) => item[0].pairId}
            scrollEnabled={true}
            style={{ marginBottom: 100 }}
            ListHeaderComponent={listHeader}
            renderItem={({ item, index }) => (
              <>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate("Pair Details", {
                      pairId: item[0].pairId,
                    })
                  }
                >
                  <View style={style.pairTableContent}>
                    <View style={style.mentorCol}>
                      <View style={style.sno}>
                        <Text>{index + 1}</Text>
                      </View>
                      <View style={style.mentorContent}>
                        <Text>{item[0].username}</Text>
                      </View>
                    </View>
                    <View style={style.menteeCol}>
                      <Text>{item[1].username}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </>
            )}
          />
        </View>
      </View>
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
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  headingText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#fff",
  },
  pairTableHeading: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    flex: 1,
  },
  mentorColHeading: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#303030",
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: "#cfcfcf",
    borderRightWidth: 2,
    paddingRight: 20,
  },
  menteeColHeading: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#303030",
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  pairTableContent: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  mentorCol: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 15,
    paddingRight: 20,
    backgroundColor: "#cfcfcf",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderRightWidth: 2,
    borderColor: "#303030",
  },
  sno: {
    flex: 2 / 6,
    justifyContent: "center",
    alignItems: "center",
  },
  mentorContent: {
    flex: 4 / 6,
    justifyContent: "center",
    alignItems: "center",
  },
  menteeCol: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#cfcfcf",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default PairDetailScreen;
