import React, { useContext, useEffect, useState } from "react";
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

const SingleNewsScreen = ({ route, navigation }) => {
  const { news } = route.params;

  const [relatedNews, setRelatedNews] = useState([]);
  const { style } = useThemeStyles();
  const { userRole } = useContext(AuthContext);

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

  return (
    <ScrollView contentContainerStyle={[styles.container, style.background]}>
      {news.imageURL && (
        <Image source={{ uri: news.imageURL }} style={styles.image} />
      )}
      <Text style={[styles.title, style.text]}>{news.title}</Text>
      <Text style={[styles.meta, style.text]}>
        {news.category} | {new Date(news.createdAt?.toDate()).toLocaleString()}
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
