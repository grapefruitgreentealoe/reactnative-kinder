import { theme } from "@/colors";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState<{
    [key: string]: { text: string; work: boolean };
  }>({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload: string) => setText(payload);
  const addToDo = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setToDos((prev) => ({
      ...prev,
      [Date.now().toString()]: { text: trimmed, work: working },
    }));
    setText("");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
          </View>
        ))}
      </ScrollView>
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
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
