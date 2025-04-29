import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useThemeStyles } from "../../context/useThemeStyles";

const BookmarkScreen = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigation = useNavigation();
  const { style } = useThemeStyles();

  useEffect(() => {
    const loadBookmarks = async () => {
      const saved = await AsyncStorage.getItem("bookmarks");
      const bookmarks = saved ? JSON.parse(saved) : [];
      setBookmarks(bookmarks);
    };

    const unsubscribe = navigation.addListener("focus", loadBookmarks);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("SingleNews", { news: item })}
      style={[styles.card, style.card]}
    >
      {item.imageURL && (
        <Image source={{ uri: item.imageURL }} style={styles.image} />
      )}
      <Text style={[styles.title, style.text]}>{item.title}</Text>
      <Text style={[styles.body, style.text]} numberOfLines={2}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style.background]}>
      {bookmarks.length === 0 ? (
        <Text style={[style.text, { textAlign: "center", marginTop: 50 }]}>
          You have no bookmarks yet.
        </Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    marginTop: 4,
  },
});
