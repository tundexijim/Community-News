import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import AppNavigator from "./AppNavigator";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { ActivityIndicator } from "react-native";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
