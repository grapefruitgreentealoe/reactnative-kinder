import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";

const { height, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const [location, setLocation] = useState<string | null>(null);
  const [ok, setOk] = useState(true);
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    //앱 사용 중에만 위치 사용
    if (!granted) {
      setOk(false);
      return;
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest, // 높은 정확도로 위치 정보 요청
    });

    console.log("latitude, longitude", latitude, longitude);

    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    console.log("location", location);
    setLocation(location[0].city || "Unknown City");
  };
  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{ok ? location : "Can't find you"}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "500",
  },
  temp: {
    fontSize: 158,
  },
  description: {
    marginTop: -30,
    fontSize: 80,
  },
});
