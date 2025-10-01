import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { memo, useEffect, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Genre options
const GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop'];

// Validation functions
const validateUsername = (username) => {
  if (username.length === 0) return '';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be 20 characters or less';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return '';
};

const validateEmail = (email) => {
  if (email.length === 0) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

const validateGenre = (genre) => {
  if (!genre) return 'Please select a favorite genre';
  return '';
};

// Simulated AsyncStorage for caching (in-memory storage)
const storage = {
  data: {},
  getItem: async (key) => storage.data[key] || null,
  setItem: async (key, value) => { storage.data[key] = value; },
  removeItem: async (key) => { delete storage.data[key]; }
};

// Profile Preview Component (memoized for optimization)
const ProfilePreview = memo(({ username, email, genre, show }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    if (show) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [show, username, email, genre]);

  if (!show) return null;

  const genreColors = {
    Pop: '#ff6b9d',
    Rock: '#c41e3a',
    Jazz: '#4a5859',
    Classical: '#8b7355',
    'Hip-Hop': '#ffa500'
  };

  const backgroundColor = genreColors[genre] || '#1DB954';

  return (
    <Animated.View
      style={[
        styles.previewContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <Text style={styles.previewTitle}>Profile Preview</Text>
      
      <View style={styles.previewContent}>
        <View style={[styles.previewAvatar, { backgroundColor }]}>
          <Text style={styles.previewAvatarText}>
            {username ? username[0].toUpperCase() : '?'}
          </Text>
        </View>

        <View style={styles.previewInfo}>
          <Text style={styles.previewUsername}>
            {username || 'Your Username'}
          </Text>
          
          <Text style={styles.previewEmail}>
            {email || 'your.email@example.com'}
          </Text>
          
          <View style={[styles.previewGenreBadge, { backgroundColor }]}>
            <Text style={styles.previewGenreText}>
              🎵 {genre || 'Select Genre'}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

export default function SignUpScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Basic Info, 2 = Profile Creation
  
  // Step 1: Basic Sign Up
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [gender, setGender] = useState('');

  // Step 2: Profile Creation
  const [username, setUsername] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [genre, setGenre] = useState('');
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [genreError, setGenreError] = useState('');
  
  const [shakeUsername, setShakeUsername] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakeGenre, setShakeGenre] = useState(false);
  
  const [errorOpacity] = useState({
    username: new Animated.Value(0),
    email: new Animated.Value(0),
    genre: new Animated.Value(0)
  });

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedUsername = await storage.getItem('username');
        const cachedEmail = await storage.getItem('profileEmail');
        const cachedGenre = await storage.getItem('genre');
        
        if (cachedUsername) setUsername(cachedUsername);
        if (cachedEmail) setProfileEmail(cachedEmail);
        if (cachedGenre) setGenre(cachedGenre);
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    };
    
    loadCachedData();
  }, []);

  // Cache data whenever it changes
  useEffect(() => {
    const cacheData = async () => {
      try {
        if (username) await storage.setItem('username', username);
        if (profileEmail) await storage.setItem('profileEmail', profileEmail);
        if (genre) await storage.setItem('genre', genre);
      } catch (error) {
        console.error('Error caching data:', error);
      }
    };
    
    cacheData();
  }, [username, profileEmail, genre]);

  // Trigger shake animation
  const triggerShake = (field) => {
    const shakeSetters = {
      username: setShakeUsername,
      email: setShakeEmail,
      genre: setShakeGenre
    };
    
    shakeSetters[field]?.(true);
    setTimeout(() => shakeSetters[field]?.(false), 500);
  };

  // Fade in/out error message
  const fadeError = (field, show) => {
    Animated.timing(errorOpacity[field], {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    const error = validateUsername(value);
    setUsernameError(error);
    
    if (error && value.length > 0) {
      triggerShake('username');
      fadeError('username', true);
    } else {
      fadeError('username', false);
    }
  };

  const handleEmailChange = (value) => {
    setProfileEmail(value);
    const error = validateEmail(value);
    setEmailError(error);
    
    if (error && value.length > 0) {
      triggerShake('email');
      fadeError('email', true);
    } else {
      fadeError('email', false);
    }
  };

  const handleGenreChange = (value) => {
    setGenre(value);
    const error = validateGenre(value);
    setGenreError(error);
    
    if (error) {
      triggerShake('genre');
      fadeError('genre', true);
    } else {
      fadeError('genre', false);
    }
  };

  const handleBasicSignUp = () => {
    // Basic validation for step 1
    if (!email || !fullName || !password || !dob.day || !dob.month || !dob.year || !gender) {
      alert('Please fill in all fields');
      return;
    }
    
    // Move to profile creation step
    setStep(2);
    // Pre-fill email from basic signup
    setProfileEmail(email);
  };

  const handleProfileComplete = async () => {
    // Validate all fields
    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(profileEmail);
    const genreErr = validateGenre(genre);
    
    setUsernameError(usernameErr);
    setEmailError(emailErr);
    setGenreError(genreErr);
    
    if (usernameErr) {
      triggerShake('username');
      fadeError('username', true);
    }
    if (emailErr) {
      triggerShake('email');
      fadeError('email', true);
    }
    if (genreErr) {
      triggerShake('genre');
      fadeError('genre', true);
    }
    
    // If no errors, complete signup
    if (!usernameErr && !emailErr && !genreErr) {
      try {
        // Clear cache
        await storage.removeItem('username');
        await storage.removeItem('profileEmail');
        await storage.removeItem('genre');
        
        // Show success message and navigate to home
        alert('Profile created successfully!');
        // Try these navigation options in order:
        setTimeout(() => {
          router.replace('/Home/HomePage');
        }, 500);
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  };

  const showPreview = username || profileEmail || genre;

  // STEP 1: Basic Sign Up
  if (step === 1) {
    return (
      <LinearGradient
        colors={['#1DB954', '#232526']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            keyboardType="email-address"
            autoCapitalize="none"
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

          {/* Register Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleBasicSignUp}>
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
              Sign in
            </Link>
          </Text>
        </ScrollView>
      </LinearGradient>
    );
  }

  // STEP 2: Profile Creation
  return (
    <LinearGradient
      colors={['#1DB954', '#232526']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo + Title */}
        <View style={styles.logoColumn}>
          <Image 
            source={require('../Image/Spotify_icon.svg.png')}  
            style={styles.logo} 
          />
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.tagline}>Just a few more details...</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Username Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username</Text>
            <Animated.View
              style={[
                styles.inputWrapper,
                {
                  transform: shakeUsername ? [
                    {
                      translateX: new Animated.Value(0).interpolate({
                        inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                        outputRange: [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0]
                      })
                    }
                  ] : []
                }
              ]}
            >
              <TextInput
                style={[styles.input, usernameError && styles.inputError]}
                placeholder="Choose a unique username"
                placeholderTextColor="#bbb"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
              />
            </Animated.View>
            {usernameError && (
              <Animated.View style={{ opacity: errorOpacity.username }}>
                <Text style={styles.errorText}>⚠️ {usernameError}</Text>
              </Animated.View>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Animated.View
              style={[
                styles.inputWrapper,
                {
                  transform: shakeEmail ? [
                    {
                      translateX: new Animated.Value(0).interpolate({
                        inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                        outputRange: [0, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0]
                      })
                    }
                  ] : []
                }
              ]}
            >
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Confirm your email"
                placeholderTextColor="#bbb"
                value={profileEmail}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animated.View>
            {emailError && (
              <Animated.View style={{ opacity: errorOpacity.email }}>
                <Text style={styles.errorText}>⚠️ {emailError}</Text>
              </Animated.View>
            )}
          </View>

          {/* Genre Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Favorite Genre</Text>
            <View style={styles.genreGrid}>
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genreButton,
                    genre === g && styles.genreButtonSelected,
                    shakeGenre && !genre && styles.genreButtonShake
                  ]}
                  onPress={() => handleGenreChange(g)}
                >
                  <Text style={[
                    styles.genreButtonText,
                    genre === g && styles.genreButtonTextSelected
                  ]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {genreError && (
              <Animated.View style={{ opacity: errorOpacity.genre }}>
                <Text style={styles.errorText}>⚠️ {genreError}</Text>
              </Animated.View>
            )}
          </View>

          {/* Profile Preview */}
          {showPreview && <Text style={styles.previewHint}>← Swipe left to see preview</Text>}
          <ProfilePreview 
            username={username}
            email={profileEmail}
            genre={genre}
            show={showPreview}
          />

          {/* Complete Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleProfileComplete}>
            <Text style={styles.signUpText}>Complete Profile ✓</Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
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
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    width: '100%',
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
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
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
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  genreButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#181818',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#222',
  },
  genreButtonSelected: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  genreButtonShake: {
    borderColor: '#ff4444',
  },
  genreButtonText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '600',
  },
  genreButtonTextSelected: {
    color: '#fff',
  },
  previewHint: {
    color: '#b3b3b3',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  previewContainer: {
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  previewTitle: {
    color: '#1DB954',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewAvatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  previewInfo: {
    alignItems: 'center',
    width: '100%',
  },
  previewUsername: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
  },
  previewEmail: {
    fontSize: 13,
    color: '#b3b3b3',
    marginBottom: 10,
  },
  previewGenreBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  previewGenreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
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
  backButton: {
    width: '100%',
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  backButtonText: {
    color: '#1DB954',
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