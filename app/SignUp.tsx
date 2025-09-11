import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [gender, setGender] = useState('');

  return (
    <LinearGradient
      colors={['#1DB954', '#232526']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Logo + Title */}
      <View style={styles.logoColumn}>
        <Image 
          source={require('../Image/Spotify_icon.svg.png')}  
          style={styles.logo} 
        />
        <Text style={styles.title}>Create your Spotify Account</Text>
        <Text style={styles.tagline}>Music for everyone, everywhere.</Text>
      </View>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Your email here"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
      />

      {/* Full Name */}
      <TextInput
        style={styles.input}
        placeholder="Type your full name"
        placeholderTextColor="#bbb"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Password */}
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Create a password"
          placeholderTextColor="#bbb"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showPass}>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {/* Date of Birth */}
      <View style={styles.dobWrapper}>
        <Text style={styles.dobLabel}>Birthday:</Text>
        <TextInput
          style={styles.dobInput}
          placeholder="DD"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={2}
          value={dob.day}
          onChangeText={(text) => setDob({ ...dob, day: text })}
        />
        <TextInput
          style={styles.dobInput}
          placeholder="MM"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={2}
          value={dob.month}
          onChangeText={(text) => setDob({ ...dob, month: text })}
        />
        <TextInput
          style={styles.dobInput}
          placeholder="YYYY"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={4}
          value={dob.year}
          onChangeText={(text) => setDob({ ...dob, year: text })}
        />
      </View>

      {/* Gender */}
      <View style={styles.genderContainer}>
        <TouchableOpacity 
          style={styles.genderOption}
          onPress={() => setGender('male')}
        >
          <View style={[styles.radioCircle, gender === 'male' && styles.radioSelected]} />
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.genderOption}
          onPress={() => setGender('female')}
        >
          <View style={[styles.radioCircle, gender === 'female' && styles.radioSelected]} />
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.genderOption}
          onPress={() => setGender('other')}
        >
          <View style={[styles.radioCircle, gender === 'other' && styles.radioSelected]} />
          <Text style={styles.genderText}>Other</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpText}>Register</Text>
      </TouchableOpacity>

      {/* Social */}
      <Text style={styles.socialText}>Continue With</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Image 
            source={require('../Image/fb_icon4.webp')} 
            style={styles.socialIcon} 
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image 
            source={require('../Image/google_icon4.webp')} 
            style={styles.socialIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Already have account */}
      <Text style={styles.signinText}>
        Have an account?{" "} 
        <Link href="/Signin" style={styles.signinLink}>
          Sign up
        </Link>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  logoColumn: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  tagline: {
    color: '#b3b3b3',
    fontSize: 13,
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 46,
    backgroundColor: '#181818',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#fff',
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#222',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 13,
  },
  showPass: {
    color: '#1DB954',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 13,
  },
  dobWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  dobLabel: {
    color: '#1DB954',
    marginRight: 10,
    fontWeight: '600',
    fontSize: 14,
  },
  dobInput: {
    width: 48,
    height: 40,
    backgroundColor: '#181818',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#222',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 18,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioSelected: {
    backgroundColor: '#1DB954',
  },
  genderText: {
    color: '#fff',
    fontSize: 13,
  },
  signUpButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#1DB954',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
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
    gap: 24,
    marginBottom: 18,
  },
  socialIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  signinText: {
    color: '#b3b3b3',
    marginTop: 6,
  },
  signinLink: {
    color: '#1DB954',
  },
});