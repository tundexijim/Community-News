import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { useThemeStyles } from "../context/useThemeStyles";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";

const AdminApprovalScreen = () => {
  const [allNews, setAllNews] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigation = useNavigation();
  const { style } = useThemeStyles();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setUserRole("admin");
        } else {
          Alert.alert("Access Denied", "Only admins can access this screen.");
          navigation.goBack();
        }
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "news"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllNews(items);
    });

    return () => unsub();
  }, []);

  const toggleApproval = async (newsItem) => {
    try {
      await updateDoc(doc(db, "news", newsItem.id), {
        approved: !newsItem.approved,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update approval status.");
    }
  };

  const handleDelete = async (newsId) => {
    Alert.alert("Confirm", "Are you sure you want to delete this news?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "news", newsId));
          } catch (error) {
            Alert.alert("Error", "Failed to delete news.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, style.card]}>
      <Text style={[styles.title, style.text]}>{item.title}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#007bff" }]}
          onPress={() => navigation.navigate("SingleNews", { news: item })}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: item.approved ? "#f59e0b" : "#22c55e" },
          ]}
          onPress={() => toggleApproval(item)}
        >
          <Text style={styles.buttonText}>
            {item.approved ? "Disapprove" : "Approve"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ef4444" }]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (userRole !== "admin") return null;

  return (
    <View style={[styles.container, style.background]}>
      <Text style={[styles.heading, style.text]}>News Approval Panel</Text>
      <FlatList
        data={allNews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default AdminApprovalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  button: {
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
});
