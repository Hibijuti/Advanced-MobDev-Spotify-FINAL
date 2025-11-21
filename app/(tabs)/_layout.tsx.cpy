import { Tabs } from "expo-router";
import React from "react";
import { Platform, Image } from "react-native";
import { Provider } from 'react-redux';
import { store } from '@/app/Home/ComponentShowcase';

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="Signin"
          options={{
            title: "Signin",
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require("../../Image/Component.png")}
                style={{
                  width: size,
                  height: size,
                  tintColor: color, 
                  resizeMode: "contain",
                }}
              />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}