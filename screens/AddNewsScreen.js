import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, db, storage } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CommonActions, useTheme } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { useThemeStyles } from "../context/useThemeStyles";
import { AuthContext } from "../context/AuthContext";

const AddNewsScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Politics");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const { style, isDark } = useThemeStyles();
  const { userRole } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const catList = snapshot.docs.map((doc) => doc.data().name); // only names needed
      setCategories(catList);
    });
    return () => unsubscribe();
  }, []);
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      return Alert.alert(
        "Permission required",
        "We need permission to access your photos."
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["image"],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `newsImages/${uuid.v4()}.jpg`);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handlePost = async () => {
    if (!title || !body || !category) {
      return Alert.alert("Validation", "Please fill all fields.");
    }

    try {
      let imageURL = "";
      if (image) {
        imageURL = await uploadImage(image);
        console.log(imageURL);
      }

      await addDoc(collection(db, "news"), {
        approved: false,
        title,
        body,
        category,
        imageURL,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "News posted successfully!");
      setTitle("");
      setBody("");
      setImage(null);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to post news.");
    }
  };

  if (userRole !== "contributor") return null;

  return (
    <View style={[styles.container, style.background]}>
      <Text style={[styles.heading, style.text]}>Post a News Article</Text>
      <TextInput
        placeholder="Title"
        placeholderTextColor={style.text.color}
        value={title}
        onChangeText={setTitle}
        style={[styles.input, style.text]}
      />
      <TextInput
        placeholder="Body"
        placeholderTextColor={style.text.color}
        value={body}
        onChangeText={setBody}
        style={[styles.input, { height: 100 }, style.text]}
        multiline
      />
      <Text style={[styles.label, style.text]}>Select Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
        itemStyle={style.text}
      >
        {categories.map((cat, index) => (
          <Picker.Item style={style.text} key={index} label={cat} value={cat} />
        ))}
      </Picker>
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Post News" onPress={handlePost} />
    </View>
  );
};

export default AddNewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});
