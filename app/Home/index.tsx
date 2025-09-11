import { Image } from 'expo-image';
import { Platform, StyleSheet, Dimensions, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <ParallaxScrollView headerBackgroundColor={{ light: "transparent", dark: "transparent" }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Welcome to Spotify Home!
        </ThemedText>
      </ThemedView>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../Image/playlist1.jpg')}
          style={styles.headerImage}
        />
      </View>
      <ThemedView style={styles.infoBox}>
        <ThemedText style={styles.infoText}>
          Discover new music, explore playlists, and enjoy your favorite tracks every day.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 0,
    marginBottom: 10,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#1DB954",
    letterSpacing: 1,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 18,
  },
  headerImage: {
    width: width * 0.8,
    height: 180,
    borderRadius: 24,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "#1DB954",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  infoBox: {
    backgroundColor: "#232323",
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});