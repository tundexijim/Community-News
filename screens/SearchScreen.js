import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useThemeStyles } from "../context/useThemeStyles";
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { style } = useThemeStyles();
  const navigation = useNavigation();

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const q = query(
        collection(db, "news"),
        where("approved", "==", true) // Only search approved news
      );
      const snapshot = await getDocs(q);
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((news) =>
          news.title.toLowerCase().includes(text.toLowerCase())
        );

      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, style.card]}
      onPress={() => navigation.navigate("SingleNews", { news: item })}
    >
      <Text style={[styles.title, style.text]}>{item.title}</Text>
      <Text style={[styles.body, style.text]} numberOfLines={2}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style.background]}>
      <TextInput
        placeholder="Search news..."
        placeholderTextColor={style.text.color + "88"}
        value={searchQuery}
        onChangeText={handleSearch}
        style={[
          styles.searchBar,
          style.text,
          { borderColor: style.text.color },
        ]}
      />

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      ) : (
        <View style={styles.noResultContainer}>
          <Text style={[styles.noResultText, style.text]}>
            Your search result will appear here
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  card: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultText: {
    fontSize: 16,
    fontStyle: "italic",
  },
});
