import { theme } from "@/colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableHighlight
          activeOpacity={0.5}
          onPress={() => console.log("Home pressed")}
          underlayColor="red"
        >
          <Text style={styles.btnText}>Work</Text>
        </TouchableHighlight>
        <Pressable>
          <Text style={styles.btnText}>Travel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    color: theme.grey,
    fontSize: 44,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
});
