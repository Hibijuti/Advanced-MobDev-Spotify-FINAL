import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width } = Dimensions.get("window");

// Theme Preset Definitions
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

// Redux Slice
const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light",
    accentColor: THEME_PRESETS.light.accentColor,
    customTheme: THEME_PRESETS.custom,
  },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
    setCustomTheme: (state, action) => {
      state.customTheme = action.payload;
      state.mode = "custom";
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
    },
  },
});

export const { setTheme, setCustomTheme, setAccentColor } = themeSlice.actions;

// Redux Store
export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default function ComponentShowcase() {
  const [userInput, setUserInput] = useState("");
  const [customAccentColor, setCustomAccentColor] = useState("#FF006E");
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
  }, [currentTheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        if (parsed.mode === "custom") {
          dispatch(setCustomTheme(parsed.customTheme));
          setCustomAccentColor(parsed.customTheme.accentColor);
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
    setCustomAccentColor(color);
    const updatedCustomTheme = {
      ...currentTheme.customTheme,
      accentColor: color,
    };
    dispatch(setCustomTheme(updatedCustomTheme));
  };

  const handlePress = () => {
    Alert.alert("Hello!", `You typed: ${userInput}`);
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: activeTheme.backgroundColor,
      flex: 1,
    },
    text: {
      color: activeTheme.textColor,
    },
    button: {
      backgroundColor: activeTheme.accentColor,
    },
    input: {
      borderColor: activeTheme.borderColor,
      backgroundColor: activeTheme.backgroundColor,
      color: activeTheme.textColor,
    },
  });

  if (!themeLoaded) {
    return null;
  }

  return (
    <View style={dynamicStyles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "transparent", dark: "transparent" }}
      >
        <ThemedView style={[styles.titleContainer, dynamicStyles.container]}>
          <ThemedText type="title" style={dynamicStyles.text}>
            Featured
          </ThemedText>
        </ThemedView>

        <Image
          source={require("../../Image/playlist2.jpg")}
          style={styles.headerGif}
        />

        {/* Theme Switcher Section */}
        <ThemedView style={[styles.section, dynamicStyles.container]}>
          <ThemedText type="subtitle" style={dynamicStyles.text}>
            Theme Settings
          </ThemedText>

          {/* Preset Themes */}
          <View style={styles.themeButtonsContainer}>
            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor:
                      currentTheme.mode === key ? preset.accentColor : preset.borderColor,
                  },
                ]}
                onPress={() => handleThemeSwitch(key as "light" | "dark" | "custom")}
              >
                <ThemedText style={{ color: preset.textColor }}>{preset.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Accent Color Picker */}
          {currentTheme.mode === "custom" && (
            <View style={styles.colorPickerContainer}>
              <ThemedText type="subtitle" style={dynamicStyles.text}>
                Custom Accent Color
              </ThemedText>
              <View style={styles.colorPreviewContainer}>
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: customAccentColor },
                  ]}
                />
                <TextInput
                  style={[styles.colorInput, dynamicStyles.input]}
                  placeholder="#FF006E"
                  placeholderTextColor={activeTheme.borderColor}
                  value={customAccentColor}
                  onChangeText={handleCustomAccentColor}
                />
              </View>
            </View>
          )}

          {/* User Input Section */}
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="Enter text..."
            placeholderTextColor={activeTheme.borderColor}
            value={userInput}
            onChangeText={setUserInput}
          />

          <TouchableOpacity style={[styles.button, dynamicStyles.button]} onPress={handlePress}>
            <ThemedText style={styles.buttonText}>Submit</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ParallaxScrollView>
    </View>
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
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  headerGif: {
    width: width,
    height: 220,
    resizeMode: "cover",
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  contentImage: {
    width: width * 0.9,
    height: 180,
    alignSelf: "center",
    borderRadius: 12,
    resizeMode: "contain",
  },
  themeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginVertical: 8,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  colorPickerContainer: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  colorPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
});