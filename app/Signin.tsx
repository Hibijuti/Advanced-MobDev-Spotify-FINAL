import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Link, useRouter } from "expo-router"; 

export default function SpotifyLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#232526', '#1DB954']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Spotify Logo */}
      <Image 
        source={require('../Image/Spotify_icon.svg.png')}
        style={styles.logo} 
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>Welcome Back!</Text>

      {/* Title */}
      <Text style={styles.title}>Log in to Spotify</Text>

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotWrapper} activeOpacity={0.7}>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Sign In */}
      <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/Home/HomePage")}>
        <Text style={styles.signInText}>Log In</Text>
      </TouchableOpacity>

      {/* Social Logins */}
      <Text style={styles.socialText}>Or sign in with</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image 
            source={require('../Image/fb_icon4.webp')} 
            style={styles.socialIcon} 
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Image 
            source={require('../Image/google_icon4.webp')} 
            style={styles.socialIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up */}
      <Text style={styles.signupText}>
        Don't have an account?
        <Link href="/SignUp" style={styles.signupLink}> Sign in</Link>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  subtitle: {
    color: '#b3b3b3',
    fontSize: 16,
    marginBottom: 2,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#181818',
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  forgotWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#b3b3b3',
    fontSize: 13,
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1DB954',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  signInText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  socialText: {
    color: '#fff', 
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  socialIcon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  signupText: {
    color: '#b3b3b3',
    marginTop: 8,
  },
  signupLink: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});