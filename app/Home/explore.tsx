import { Image } from 'expo-image';
import { StyleSheet, Dimensions, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get("window");

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "transparent", dark: "transparent" }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>Explore Music</ThemedText>
      </ThemedView>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../Image/playlist2.jpg')}
          style={styles.headerImage}
        />
      </View>
      <ThemedView style={styles.infoBox}>
        <ThemedText style={styles.infoText}>
          Dive into new genres, discover trending artists, and expand your playlist!
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  titleText: {
    color: "#1DB954",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
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
    borderColor: "#1DB954",
    resizeMode: "cover",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  infoBox: {
    backgroundColor: "#232323",
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
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});