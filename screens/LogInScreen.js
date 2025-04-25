import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { setPersistence } from "firebase/auth";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useThemeStyles } from "../context/useThemeStyles";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { style, isDark } = useThemeStyles();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // setPersistence(auth, browserLocalPersistence);
      // console.log(user);
      if (user) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Main" }],
          })
        );
      }
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={[styles.container, style.background]}>
      <TextInput
        placeholder="Email"
        placeholderTextColor={isDark ? "#D1D5DB" : "	#6B7280"}
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          {
            borderColor: isDark ? "#444" : "#ccc", // theme‑driven border color
            borderBottomWidth: 1, // ensure the border is visible
          },
          style.text,
        ]}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={isDark ? "#D1D5DB" : "	#6B7280"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          {
            borderColor: isDark ? "#444" : "#ccc", // theme‑driven border color
            borderBottomWidth: 1, // ensure the border is visible
          },
          style.text,
        ]}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={[styles.row, { marginTop: 20 }]}>
        <Text style={[styles.label, style.text]}>Not registered?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[styles.link, style.text]}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { marginBottom: 15, borderBottomWidth: 1, padding: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // or 'flex-start' / 'flex-end'
  },
  label: {
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 4,
  },
});

export default LoginScreen;
