import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useThemeStyles } from "../context/useThemeStyles";
import { CommonActions, useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { style, isDark } = useThemeStyles();
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "reader",
      });

      Alert.alert("Signup Successful", "Welcome to Community News!");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
    } catch (error) {
      Alert.alert("Signup Error", error.message);
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
            borderColor: isDark ? "#444" : "#ccc",
            borderBottomWidth: 1,
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
            borderColor: isDark ? "#444" : "#ccc",
            borderBottomWidth: 1,
          },
          style.text,
        ]}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  input: { marginBottom: 15, borderBottomWidth: 1, padding: 8 },
});

export default SignUpScreen;
