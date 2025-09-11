import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <Link href="/Home" style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>Spotify</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  linkText: {
    color: "#fff",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: "#fff",
  },
  link: {
    marginTop: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#1DB954",
    borderRadius: 25,
    // 3D effect for the Spotify button
    shadowColor: "#145c2c",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: "#13e05a",
  },
});
