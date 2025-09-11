import React, { useState } from "react";
import { StyleSheet, Alert, Dimensions, TextInput, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HelloWave } from "@/components/HelloWave";

const { width } = Dimensions.get("window");

export default function ComponentShowcase() {
  const [userInput, setUserInput] = useState("");

  const handlePress = () => {
    Alert.alert("Hello!", `You typed: ${userInput}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "transparent", dark: "transparent" }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Featured</ThemedText>
      </ThemedView>

      <Image
        source={require("../../Image/playlist2.jpg")}
        style={styles.headerGif}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginTop: 0,
    justifyContent: "center",
  },
  section: {
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  headerGif: {
    width: width,
    height: 220,
    resizeMode: "cover",
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#1DB954",
    paddingVertical: 10,
    borderRadius: 8,
    textAlign: "center",
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  contentImage: {
    width: width * 0.9,
    height: 180,
    alignSelf: "center",
    borderRadius: 12,
    resizeMode: "contain",
  },
});