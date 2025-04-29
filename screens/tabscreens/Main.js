import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewsFeedScreen from "./NewsFeedScreen";
import CategoriesScreen from "./CategoriesScreen";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import PanelScreen from "./PanelScreen";
import { useThemeStyles } from "../../context/useThemeStyles";
import BookmarkScreen from "./BookmarkScreens";

const Tab = createBottomTabNavigator();

const Main = () => {
  const { isDark, style } = useThemeStyles();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "News Feed") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Categories") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "More") {
            iconName = "ellipsis-vertical";
          } else if (route.name === "Bookmarks") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: isDark ? "#1E1E1E" : "#fff", // or use theme.card
        },
        headerTitleStyle: {
          color: isDark ? "white" : "black",
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ fontFamily: "monospace", fontSize: 12, color }}>
            {route.name}
          </Text>
        ),

        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          backgroundColor: isDark ? "#1E1E1E" : "#fff",
          borderTopColor: isDark ? "#1E1E1E" : "#fff",
        },
      })}
    >
      <Tab.Screen
        name="News Feed"
        component={NewsFeedScreen}
        options={{
          tabBarLabelStyle: {
            Color: isDark ? "#1E1E1E" : "#ffffff",
          },
        }}
      />
      <Tab.Screen
        name="Categories"
        options={{ title: "" }}
        component={CategoriesScreen}
      />
      <Tab.Screen
        name="Bookmarks"
        options={{ title: "" }}
        component={BookmarkScreen}
      />
      <Tab.Screen name="More" options={{ title: "" }} component={PanelScreen} />
    </Tab.Navigator>
  );
};

export default Main;
