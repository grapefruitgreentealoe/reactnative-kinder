import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

/** Location 객체에 대한 타입 */

interface LocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string; // 예: 서울특별시
  country?: string; // 예: 대한민국
  formattedAddress?: string;
}
/** */

const { width: SCREEN_WIDTH } = Dimensions.get("window");
/**util for google geolocation in web */
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY; // TODO: web에서만 사용
const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY; // TODO: 날씨 API 키

async function getReverseGeocode(
  lat: number,
  lng: number
): Promise<LocationInfo> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new Error("Permission denied");
  const arr = await Location.reverseGeocodeAsync({
    latitude: lat,
    longitude: lng,
  });
  const o = arr[0];
  return {
    latitude: lat,
    longitude: lng,
    city: o.city!,
    region: (o.region || o.subregion)!,
    country: o.country!,
    formattedAddress: [o.name, o.street, o.region, o.country]
      .filter(Boolean)
      .join(" "),
  };
}

/*---------------*/

/** platform에 따른 좌표 가져오는 함수 */
async function getCoords() {
  if (Platform.OS === "web") {
    // 브라우저 Geolocation API
    return new Promise<{ latitude: number; longitude: number }>(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
        }
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            resolve({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
          },
          // (err) => reject(err),
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              reject(new Error("PermissionDeniedError"));
            } else {
              reject(new Error("GeolocationError"));
            }
          },
          { enableHighAccuracy: true }
        );
      }
    );
  } else {
    // Native(iOS/Android)
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) throw new Error("PermissionDeniedError");
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    return { latitude, longitude };
  }
}

/*---------------- */

// types.ts
export interface WeatherInfo {
  id: number;
  main: IconName;
  description: string;
  icon: string;
}

export interface DailyWeather {
  dt: number;
  temp: { day: string; min: number; max: number };
  weather: WeatherInfo[];
}

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Rain: "rains",
  Drizzle: "rains",
  Snow: "snow",
  Thunderstorm: "lightning",
} as const; // 타입 안전성을 위해 const로 선언

type WeatherMain = keyof typeof icons; // "Clouds"|"Clear"|...
type IconName = (typeof icons)[WeatherMain]; // "cloudy"|"day-sunny"|...

export default function HomeScreen() {
  const [location, setLocation] = useState<string | null>(null);
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState<DailyWeather[]>([]); // 날씨 데이터를 저장할 상태 변수
  const ask = async () => {
    try {
      const { latitude, longitude } = await getCoords();
      const location = await getReverseGeocode(latitude, longitude);
      //location에 맞는 날씨를 가져오기
      const { latitude: lat, longitude: lon } = location;
      // 날씨 API 호출 (예: OpenWeatherMap)
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const json = await response.json();
      setDays(json.daily);
      if (!location) {
        setOk(false);
        return;
      }
      setOk(true);
      setLocation(location.city || "Unknown City");
    } catch (error) {
      console.error("Error fetching location:", error);
      setOk(false);
      setLocation(null);
    }
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
        {days.length === 0 ? (
          <ActivityIndicator
            color="white"
            style={{ marginTop: 10 }}
            size="large"
          />
        ) : (
          days.map((day, index) => {
            const main = day.weather[0].main as WeatherMain;

            return (
              <View style={styles.day} key={index}>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto name={icons[main]} size={68} color="white" />
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>
                  {day.weather[0].description}
                </Text>
              </View>
            );
          })
        )}
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
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  description: {
    marginTop: -30,
    fontSize: 80,
  },
  tinyText: {
    fontSize: 20,
  },
});
