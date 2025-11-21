import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Import Redux store from ComponentShowcase
import { RootState, setCustomTheme, setTheme } from "@/app/Home/ComponentShowcase";

const { width } = Dimensions.get("window");

// Theme Preset Definitions (matching ComponentShowcase)
const THEME_PRESETS = {
  light: {
    name: "Light",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    accentColor: "#1DB954",
    borderColor: "#E0E0E0",
  },
  dark: {
    name: "Dark",
    backgroundColor: "#121212",
    textColor: "#FFFFFF",
    accentColor: "#1DB954",
    borderColor: "#282828",
  },
  custom: {
    name: "Custom",
    backgroundColor: "#121212",
    textColor: "#FFFFFF",
    accentColor: "#FF006E",
    borderColor: "#282828",
  },
};

// Custom Accent Colors for color picker
const CUSTOM_ACCENTS = [
  { name: "Spotify Green", color: "#1DB954" },
  { name: "Purple", color: "#8B5CF6" },
  { name: "Blue", color: "#3B82F6" },
  { name: "Orange", color: "#F97316" },
  { name: "Pink", color: "#FF006E" },
];

export default function TabTwoScreen() {
  const [themeLoaded, setThemeLoaded] = useState(false);
  
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme);

  // Get active theme based on mode
  const activeTheme =
    currentTheme.mode === "custom"
      ? currentTheme.customTheme
      : THEME_PRESETS[currentTheme.mode as keyof typeof THEME_PRESETS];

  // Persist and restore theme
  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (themeLoaded) {
      saveTheme();
    }
  }, [currentTheme, themeLoaded]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        if (parsed.mode === "custom") {
          dispatch(setCustomTheme(parsed.customTheme));
        } else {
          dispatch(setTheme(parsed.mode));
        }
      }
      setThemeLoaded(true);
    } catch (error) {
      console.log("Error loading theme:", error);
      setThemeLoaded(true);
    }
  };

  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem("appTheme", JSON.stringify(currentTheme));
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const handleThemeSwitch = (newMode: "light" | "dark" | "custom") => {
    dispatch(setTheme(newMode));
  };

  const handleCustomAccentColor = (color: string) => {
    const updatedCustomTheme = {
      ...currentTheme.customTheme,
      accentColor: color,
    };
    dispatch(setCustomTheme(updatedCustomTheme));
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: activeTheme.backgroundColor,
    },
    text: {
      color: activeTheme.textColor,
    },
    card: {
      backgroundColor: activeTheme.backgroundColor === "#FFFFFF" ? "#F5F5F5" : "#181818",
    },
  });

  if (!themeLoaded) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, dynamicStyles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title with dynamic accent color */}
          <ThemedText type="title" style={[styles.titleText, { color: activeTheme.accentColor }]}>
            Explore Music
          </ThemedText>

          {/* Image with dynamic border color */}
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../Image/playlist2.jpg")}
              style={[styles.headerImage, { borderColor: activeTheme.accentColor }]}
            />
          </View>

          {/* Info box with dynamic styling */}
          <ThemedView style={[styles.infoBox, dynamicStyles.card]}>
            <ThemedText style={[styles.infoText, dynamicStyles.text]}>
              Dive into new genres, discover trending artists, and expand your playlist!
            </ThemedText>
          </ThemedView>

          {/* Theme Switcher Section */}
          <ThemedView style={[styles.themeSection, dynamicStyles.card]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.text]}>
              Choose Theme
            </ThemedText>
            
            {/* Preset Themes: Light, Dark, Custom */}
            <View style={styles.themeButtons}>
              {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor: preset.backgroundColor,
                      borderColor: currentTheme.mode === key ? activeTheme.accentColor : preset.borderColor,
                      borderWidth: currentTheme.mode === key ? 3 : 1,
                    },
                  ]}
                  onPress={() => handleThemeSwitch(key as "light" | "dark" | "custom")}
                >
                  <ThemedText style={{ color: preset.textColor, fontWeight: "600" }}>
                    {preset.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>

          {/* Custom Accent Colors - Color picker */}
          <ThemedView style={[styles.themeSection, dynamicStyles.card]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, dynamicStyles.text]}>
              Accent Colors
            </ThemedText>
            <View style={styles.colorPicker}>
              {CUSTOM_ACCENTS.map((accent) => (
                <TouchableOpacity
                  key={accent.name}
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: accent.color,
                      borderColor: activeTheme.accentColor === accent.color ? "#FFF" : "transparent",
                      borderWidth: 3,
                    },
                  ]}
                  onPress={() => handleCustomAccentColor(accent.color)}
                />
              ))}
            </View>
            <ThemedText style={[styles.colorHint, dynamicStyles.text]}>
              Tap a color to customize your theme
            </ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 18,
  },
  headerImage: {
    width: width * 0.85,
    height: 170,
    borderRadius: 22,
    borderWidth: 2,
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  infoBox: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  infoText: {
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  themeSection: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  themeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  colorHint: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
});