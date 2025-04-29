import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig"; // adjust path if needed
import { signOut } from "firebase/auth";
import { useThemeStyles } from "../../context/useThemeStyles";
import { AuthContext } from "../../context/AuthContext";

const PanelScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { style, toggleTheme, isDark } = useThemeStyles();
  const { user, userRole } = useContext(AuthContext);

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const notif = await AsyncStorage.getItem("notifications");

      if (notif !== null) setNotificationsEnabled(JSON.parse(notif));
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage
  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("notifications", JSON.stringify(value));
  };

  const handleAbout = () => {
    Alert.alert(
      "About Us",
      "This is a community news app built to keep you informed."
    );
  };

  const handleContact = () => {
    Alert.alert("Contact Us", "Email: support@newsapp.com");
  };

  const handleRate = () => {
    Alert.alert("Rate Us", "Redirecting to Play Store...");
  };

  const handleAuth = async () => {
    if (user) {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been signed out.");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={[styles.container, style.background]}>
      <View style={styles.section}>
        <Text style={[styles.label, style.text]}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, style.text]}>Dark Theme</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={styles.item} onPress={handleAbout}>
        <Text style={[styles.itemText, style.text]}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleContact}>
        <Text style={[styles.itemText, style.text]}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleRate}>
        <Text style={[styles.itemText, style.text]}>Rate Us</Text>
      </TouchableOpacity>

      {userRole === "contributor" && (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("AddNews")}
        >
          <Text style={[styles.itemText, style.text]}>Add News</Text>
        </TouchableOpacity>
      )}

      {userRole === "admin" && (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Admin")}
        >
          <Text style={[styles.itemText, style.text]}>Approve News</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleAuth}>
        <Text style={styles.loginText}>{user ? "Log Out" : "Log In"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PanelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  loginButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#007bff",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
