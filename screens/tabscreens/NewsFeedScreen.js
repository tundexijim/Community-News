import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useThemeStyles } from "../../context/useThemeStyles";
import { Ionicons } from "@expo/vector-icons";

const NewsFeedScreen = ({ navigation }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { style } = useThemeStyles();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.6}
        >
          <Ionicons name="search-outline" size={24} color={style.text.color} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, style]);

  useEffect(() => {
    const q = query(
      collection(db, "news"),
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(newsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // console.log("NewsList", newsLis0t);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={newsList}
      style={style.background}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("SingleNews", { news: item })}
        >
          <View style={[styles.card, style.card]}>
            {item.imageURL && (
              <Image source={{ uri: item.imageURL }} style={styles.image} />
            )}
            <Text style={[styles.title, style.text]}>{item.title}</Text>
            <Text style={[styles.meta, style.text]}>
              {item.authorName} |{" "}
              {new Date(item.createdAt?.toDate()).toLocaleString()}
            </Text>
            <Text style={style.text}>{item.body?.substring(0, 100)}.....</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  meta: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
});

export default NewsFeedScreen;
