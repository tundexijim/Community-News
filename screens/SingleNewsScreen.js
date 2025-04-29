import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useThemeStyles } from "../context/useThemeStyles";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const SingleNewsScreen = ({ route, navigation }) => {
  const { news } = route.params;

  const [relatedNews, setRelatedNews] = useState([]);
  const { style } = useThemeStyles();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "news"),
      where("category", "==", news.category),
      where("approved", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.id !== news.id); // exclude current article
      setRelatedNews(items);
    });

    return () => unsubscribe();
  }, [news]);

  useEffect(() => {
    checkIfBookmarked();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleBookmark}>
          <Ionicons
            name={isBookmarked ? "heart" : "heart-outline"}
            size={24}
            color={isBookmarked ? "red" : style.text.color}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isBookmarked, style]);

  const checkIfBookmarked = async () => {
    const saved = await AsyncStorage.getItem("bookmarks");
    const bookmarks = saved ? JSON.parse(saved) : [];
    const found = bookmarks.find((item) => item.id === news.id);
    setIsBookmarked(!!found);
  };

  const toggleBookmark = async () => {
    const saved = await AsyncStorage.getItem("bookmarks");
    const bookmarks = saved ? JSON.parse(saved) : [];

    if (isBookmarked) {
      // remove bookmark
      const updated = bookmarks.filter((item) => item.id !== news.id);
      await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      // add bookmark
      await AsyncStorage.setItem(
        "bookmarks",
        JSON.stringify([news, ...bookmarks])
      );
      setIsBookmarked(true);
    }
  };
  const formatDate = (createdAt) => {
    if (!createdAt) return ""; // safeguard

    if (createdAt.toDate) {
      // Firestore Timestamp object
      return new Date(createdAt.toDate()).toLocaleString();
    } else if (typeof createdAt === "string") {
      // Already a string (from AsyncStorage)
      return new Date(createdAt).toLocaleString();
    } else {
      return ""; // fallback
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, style.background]}>
      {news.imageURL && (
        <Image source={{ uri: news.imageURL }} style={styles.image} />
      )}
      <Text style={[styles.title, style.text]}>{news.title}</Text>
      <Text style={[styles.meta, style.text]}>
        {news.category} | {formatDate(news.createdAt)}
      </Text>
      <Text style={[styles.body, style.text]}>{news.body}</Text>

      {relatedNews.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.relatedTitle, style.text]}>Related News</Text>
          <FlatList
            data={relatedNews}
            keyExtractor={(item) => item.id}
            grid
            // showsHorizontalScrollIndicator={true}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.relatedCard, style.card]}
                onPress={() => navigation.push("SingleNews", { news: item })}
              >
                {item.imageURL && (
                  <Image
                    source={{ uri: item.imageURL }}
                    style={styles.relatedImage}
                  />
                )}
                <Text style={[styles.relatedText, style.text]}>
                  {item.title?.substring(0, 60)}...
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default SingleNewsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // flex: 1,
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "justify",
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  relatedCard: {
    width: 180,
    marginTop: 12,
    borderRadius: 10,
    padding: 10,
  },

  relatedImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },

  relatedText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
