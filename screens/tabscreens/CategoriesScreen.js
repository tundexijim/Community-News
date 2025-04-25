import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeStyles } from "../../context/useThemeStyles";

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { style, isDark } = useThemeStyles();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const cats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(cats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderIcon = (iconName, type) => {
    if (type === "Ionicons") {
      return <Ionicons name={iconName} size={24} style={style.text} />;
    }
    if (type === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons name={iconName} size={24} style={style.text} />
      );
    }
    return null;
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={[styles.container, style.background]}>
      <Text style={[styles.heading, style.text]}>Categories</Text>
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryCard, style.card]}
            onPress={() => console.log(`Pressed ${cat.name}`)}
          >
            {renderIcon(cat.icon, cat.type)}
            <Text style={[styles.label, style.text]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  label: {
    marginTop: 10,
    fontWeight: "500",
  },
});
