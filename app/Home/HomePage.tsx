import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";

const Drawer = createDrawerNavigator();

function ProfileScreen() {
  const user = {
    name: "KyleTzy",
    email: "KyleJayversonBaguio@gmailz.com",
    profilePic: require("../../Image/ProfilePic1.png"),
  };

  return (
    <View style={styles.profileContainer}>
      <Image source={user.profilePic} style={styles.profile} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
}

function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.center}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/Signin")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function PlaylistScreen() {
  const playlists = [
    {
      id: "1",
      title: "David Laid",
      cover: require("../../Image/playlist1.jpg"),
    },
    {
      id: "2",
      title: "David Bowie",
      cover: require("../../Image/playlist2.jpg"),
    },
    {
      id: "4",
      title: "Lebron James",
      cover: require("../../Image/playlist4.jpg"),
    },
  ];

  return (
    <View style={styles.center}>
      <Text style={styles.playlistHeader}>Favorites</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playlistCardAlt}>
            <Image source={item.cover} style={styles.playlistCover} />
            <View style={{ flex: 1 }}>
              <Text style={styles.playlistTitle}>{item.title}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default function HomePage() {
  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#181c24",
          width: 290,
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          shadowColor: "#1DB954",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        },
        drawerActiveTintColor: "#1DB954",
        drawerInactiveTintColor: "#b0b0b0",
        drawerActiveBackgroundColor: "#232b36",
        drawerLabelStyle: {
          fontSize: 20,
          fontWeight: "900",
          letterSpacing: 1,
          marginLeft: -10,
        },
        headerStyle: {
          backgroundColor: "#181c24",
          borderBottomWidth: 0,
          shadowColor: "transparent",
        },
        headerTintColor: "#1DB954",
        headerTitleAlign: "center",
      }}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Playlists" component={PlaylistScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    padding: 20,
    backgroundColor: "#277944ff",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#277944ff",
  },
  profile: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d0d0dff",
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#000000ff",
    textAlign: "center",
    marginBottom: 30,
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#277944ff",
    borderRadius: 25,
    alignItems: "center",
  },
  logoutText: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  playlistHeader: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1DB954",
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: "center",
  },
  playlistSubheader: {
    fontSize: 13,
    color: "#b0ffb0",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  playlistCardAlt: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    backgroundColor: "#575757",
    padding: 10,
    borderRadius: 18,
    width: 200,
    height: 200,
    alignSelf: "center",
    marginHorizontal: 8,
    elevation: 3,
  },
  playlistCover: {
    width: 140,
    height: 120,
    borderRadius: 14,
    marginBottom: 8,
    marginRight: 0,
  },
  playlistTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  playlistDesc: {
    fontSize: 11,
    color: "#d0ffd0",
    marginTop: 0,
    textAlign: "center",
  },
});