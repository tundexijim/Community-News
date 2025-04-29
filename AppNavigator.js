import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import your screens
// import NewsFeedScreen from "./screens/tabscreens/NewsFeedScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LogInScreen";
import AddNewsScreen from "./screens/AddNewsScreen"; // Create this screen next
import SingleNewsScreen from "./screens/SingleNewsScreen";
import { Ionicons } from "@expo/vector-icons";
import Main from "./screens/tabscreens/Main";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useThemeStyles } from "./context/useThemeStyles";
import { AuthContext } from "./context/AuthContext";
import AdminApprovalScreen from "./screens/AdminApprovalScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isDark, style } = useThemeStyles();
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: isDark ? "#1E1E1E" : "#fff", // or use theme.card
          },
          headerTitleStyle: {
            color: isDark ? "white" : "black",
          },
          headerBackTitleVisible: false,
        })}
      >
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: "Create Account" }}
        />
        <Stack.Screen
          name="AddNews"
          component={AddNewsScreen}
          options={{ title: "Add News" }}
        />
        <Stack.Screen
          name="SingleNews"
          component={SingleNewsScreen}
          options={{ title: "News Details" }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminApprovalScreen}
          options={{ title: "News Approval" }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: "Search" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
