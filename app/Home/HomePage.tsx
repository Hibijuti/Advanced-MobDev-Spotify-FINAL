import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Drawer = createDrawerNavigator();

// Playlist Reducer for state management with history
const playlistReducer = (state, action) => {
  switch (action.type) {
    case "ADD_SONG":
      return {
        ...state,
        songs: [...state.songs, { id: Date.now().toString(), name: action.payload }],
        history: [...state.history, { type: "ADD_SONG", song: { id: Date.now().toString(), name: action.payload } }],
        future: [],
      };
    
    case "REMOVE_SONG":
      const songToRemove = state.songs.find(s => s.id === action.payload);
      return {
        ...state,
        songs: state.songs.filter(song => song.id !== action.payload),
        history: [...state.history, { type: "REMOVE_SONG", song: songToRemove }],
        future: [],
      };
    
    case "CLEAR_PLAYLIST":
      return {
        ...state,
        songs: [],
        history: [...state.history, { type: "CLEAR_PLAYLIST", songs: state.songs }],
        future: [],
      };
    
    case "UNDO":
      if (state.history.length === 0) return state;
      const lastAction = state.history[state.history.length - 1];
      let newSongs = [...state.songs];
      
      if (lastAction.type === "ADD_SONG") {
        newSongs = state.songs.filter(s => s.id !== lastAction.song.id);
      } else if (lastAction.type === "REMOVE_SONG") {
        newSongs = [...state.songs, lastAction.song];
      } else if (lastAction.type === "CLEAR_PLAYLIST") {
        newSongs = lastAction.songs;
      }
      
      return {
        ...state,
        songs: newSongs,
        history: state.history.slice(0, -1),
        future: [...state.future, lastAction],
      };
    
    case "REDO":
      if (state.future.length === 0) return state;
      const nextAction = state.future[state.future.length - 1];
      let redoSongs = [...state.songs];
      
      if (nextAction.type === "ADD_SONG") {
        redoSongs = [...state.songs, nextAction.song];
      } else if (nextAction.type === "REMOVE_SONG") {
        redoSongs = state.songs.filter(s => s.id !== nextAction.song.id);
      } else if (nextAction.type === "CLEAR_PLAYLIST") {
        redoSongs = [];
      }
      
      return {
        ...state,
        songs: redoSongs,
        history: [...state.history, nextAction],
        future: state.future.slice(0, -1),
      };
    
    case "RESTORE_STATE":
      return action.payload;
    
    default:
      return state;
  }
};

// Swipeable Song Item Component with Delete
const SongItem = memo(({ song, onRemove, index }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideInAnim] = useState(new Animated.Value(-50));
  const translateX = useRef(new Animated.Value(0)).current;
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideInAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow swiping left (negative values)
        if (gestureState.dx < 0) {
          // Limit swipe to -80 pixels
          const newValue = Math.max(gestureState.dx, -80);
          translateX.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40) {
          // Swipe far enough, snap to open position
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: true,
            friction: 8,
          }).start();
        } else {
          // Snap back to closed position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleRemove = () => {
    setIsDeleting(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(song.id);
    });
  };

  return (
    <View style={styles.songItemContainer}>
      {/* Delete Button Background */}
      <View style={styles.deleteBackground}>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleRemove}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Song Item */}
      <Animated.View
        style={[
          styles.songItem,
          {
            opacity: fadeAnim,
            transform: [
              { translateX: slideInAnim },
              { translateX: translateX },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.songInfo}>
          <Text style={styles.songNumber}>{index + 1}</Text>
          <Text style={styles.songName}>{song.name}</Text>
        </View>
        <View style={styles.swipeIndicator}>
          <Text style={styles.swipeIndicatorText}>⟨</Text>
        </View>
      </Animated.View>
    </View>
  );
});

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

function PlaylistManagerScreen() {
  const initialState = {
    songs: [],
    history: [],
    future: [],
  };

  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const [songInput, setSongInput] = useState("");

  const handleAddSong = () => {
    if (songInput.trim()) {
      dispatch({ type: "ADD_SONG", payload: songInput.trim() });
      setSongInput("");
    } else {
      Alert.alert("Empty Input", "Please enter a song name");
    }
  };

  const handleRemoveSong = useCallback((id) => {
    dispatch({ type: "REMOVE_SONG", payload: id });
  }, []);

  const handleClearPlaylist = () => {
    if (state.songs.length > 0) {
      Alert.alert(
        "Clear Playlist",
        "Are you sure you want to clear all songs?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear", onPress: () => dispatch({ type: "CLEAR_PLAYLIST" }) },
        ]
      );
    }
  };

  const handleUndo = () => {
    if (state.history.length > 0) {
      dispatch({ type: "UNDO" });
    }
  };

  const handleRedo = () => {
    if (state.future.length > 0) {
      dispatch({ type: "REDO" });
    }
  };

  return (
    <View style={styles.center}>
      <Text style={styles.playlistHeader}>My Playlist</Text>
      <Text style={styles.songCount}>{state.songs.length} songs</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter song name..."
          placeholderTextColor="#999"
          value={songInput}
          onChangeText={setSongInput}
          onSubmitEditing={handleAddSong}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddSong}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, state.history.length === 0 && styles.disabledButton]}
          onPress={handleUndo}
          disabled={state.history.length === 0}
        >
          <Text style={styles.actionButtonText}>↶ Undo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, state.future.length === 0 && styles.disabledButton]}
          onPress={handleRedo}
          disabled={state.future.length === 0}
        >
          <Text style={styles.actionButtonText}>↷ Redo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClearPlaylist}
        >
          <Text style={styles.actionButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Hint Text */}
      {state.songs.length > 0 && (
        <Text style={styles.swipeHint}>← Swipe left to delete songs</Text>
      )}

      {/* Playlist */}
      {state.songs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>🎵</Text>
          <Text style={styles.emptyStateSubtext}>Your playlist is empty</Text>
          <Text style={styles.emptyStateHint}>Add some songs to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={state.songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SongItem song={item} onRemove={handleRemoveSong} index={index} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
      <Drawer.Screen name="Playlist Manager" component={PlaylistManagerScreen} />
      <Drawer.Screen name="Favorites" component={PlaylistScreen} />
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
    backgroundColor: "#1DB954",
    borderRadius: 25,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
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
  songCount: {
    fontSize: 14,
    color: "#b0ffb0",
    marginBottom: 20,
    textAlign: "center",
  },
  swipeHint: {
    fontSize: 12,
    color: "#b0ffb0",
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    backgroundColor: "#1DB954",
    borderRadius: 15,
    width: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#555",
    opacity: 0.5,
  },
  clearButton: {
    backgroundColor: "#ff4444",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  songItemContainer: {
    marginBottom: 10,
    height: 70,
    position: "relative",
  },
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4444",
    borderRadius: 12,
  },
  deleteButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    height: 70,
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  songNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1DB954",
    marginRight: 15,
    width: 30,
  },
  songName: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  swipeIndicator: {
    marginLeft: 10,
  },
  swipeIndicatorText: {
    color: "#999",
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  emptyStateHint: {
    fontSize: 14,
    color: "#b0ffb0",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
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