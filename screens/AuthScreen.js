import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Dialog, Portal} from 'react-native-paper';
import axios from 'axios';
import * as secureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import {useDispatch} from 'react-redux'
import { userInfo } from '../features/userInfo';
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [message, setMessage] = useState();
  const [expoPushToken, setExpoPushToken] = useState("");

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
 const navigation = useNavigation()
 const dispatch = useDispatch();

 Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

  React.useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (form, field, value) => {
    if (form === 'signup') {
      setSignUpData({ ...signUpData, [field]: value });
    } else {
      setSignInData({ ...signInData, [field]: value });
    }
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateSignUp = () => {
    const newErrors = {};
    if (!signUpData.name) newErrors.name = 'Name is required';
    if (!signUpData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!signUpData.password) {
      newErrors.password = 'Password is required';
    } else if (signUpData.password.length < 6) {
      newErrors.password = 'At least 6 characters';
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignIn = () => {
    const newErrors = {};
    if (!signInData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!signInData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) return;
    setIsLoading(true);
    try{
    const result = await axios.post('http://localhost:3000/api/user', signUpData);
    if(result.data.success){
      setMessage(result.data.message)
      setNotification(true);
      
      
    }
    setTimeout(() => {
      setIsLoading(false);
      
      setIsSignUp(false);
      setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
    }, 1500);
  }catch(err){
    setIsLoading(false)
    if(err.response?.data?.message){
     setMessage(err.response?.data?.message)
      setNotification(true);
}

  }
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;
    setIsLoading(true);
    try{
      const result = await axios.post('http://localhost:3000/api/user/login', signInData);
    if(result.data.success){
      setMessage(result.data.message)
      setNotification(true);
      console.log(result.data.token)
      await AsyncStorage.setItem('token', result.data.token);
      const token = await AsyncStorage.getItem('token');
      const result1 = await axios.get(`http://localhost:3000/api/user/${token}` );
      if(result1.data.success){
        await Notifications.scheduleNotificationAsync({
            content: {
              title: "Hello 👋",
              body: result1.data.message
            },
            trigger: null, // immediately
          });
        dispatch(userInfo(result1.data.data))
        setTimeout(()=>{
          navigation.navigate('TabNavigator')

        },2000)
        
        
      }

      
    }
    setTimeout(() => {
      setIsLoading(false);
    
      
    }, 1500);
  }catch(err){
    setIsLoading(false)
    console.log(err.message)
    if(err.response?.data?.message){
     setMessage(err.response?.data?.message)
      setNotification(true);
}
  }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    // Reset animation
    slideAnim.setValue(100);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) setExpoPushToken(token);
    });
  }, []);
  async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted for notifications!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    alert("Must use physical device for Push Notifications!");
  }

  if (Platform.OS === "android" ) {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
  return (
    <>  
     <View>
      <Portal>
        <Dialog
          visible={notification}
          onDismiss={() => setNotification(false)}
          style={styles.dialogBox}
        >
          <Dialog.Content>
            <Text style={styles.dialogText}>{message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={() => setNotification(false)}
              style={styles.doneButton}
              labelStyle={styles.buttonLabel}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
    
    <LinearGradient colors={['#e3f2fd', '#f8f9fa']} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              {/* Logo and Title */}
              <View style={styles.header}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={styles.logo}
                
                />
                <Text style={styles.title}>HealthGuard Pro</Text>
                <Text style={styles.subtitle}>
                  {isSignUp ? 'Create your account' : 'Sign in to continue'}
                </Text>
              </View>

              {isSignUp ? (
                <>
                  {/* SIGN UP FORM */}
                  <View style={styles.inputContainer}>
                    <Icon name="person-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#90a4ae"
                      value={signUpData.name}
                      onChangeText={(text) => handleChange('signup', 'name', text)}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor="#90a4ae"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={signUpData.email}
                      onChangeText={(text) => handleChange('signup', 'email', text)}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#90a4ae"
                      secureTextEntry={!showPassword}
                      value={signUpData.password}
                      onChangeText={(text) => handleChange('signup', 'password', text)}
                    />
                    <TouchableOpacity 
                      style={styles.passwordToggle} 
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#90a4ae" />
                    </TouchableOpacity>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor="#90a4ae"
                      secureTextEntry={!showConfirmPassword}
                      value={signUpData.confirmPassword}
                      onChangeText={(text) => handleChange('signup', 'confirmPassword', text)}
                    />
                    <TouchableOpacity 
                      style={styles.passwordToggle} 
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Icon name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#90a4ae" />
                    </TouchableOpacity>
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                  </View>

                  <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSignUp}
                    disabled={isLoading}
                  >
                    <LinearGradient 
                      colors={['#4CAF50', '#2E7D32']} 
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <Text style={styles.buttonText}>Creating Account...</Text>
                      ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* SIGN IN FORM */}
                  <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor="#90a4ae"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={signInData.email}
                      onChangeText={(text) => handleChange('signin', 'email', text)}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#90a4ae"
                      secureTextEntry={!showPassword}
                      value={signInData.password}
                      onChangeText={(text) => handleChange('signin', 'password', text)}
                    />
                    <TouchableOpacity 
                      style={styles.passwordToggle} 
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#90a4ae" />
                    </TouchableOpacity>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  <View style={styles.rememberContainer}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={() => setRememberMe(!rememberMe)}
                    >
                      <View style={rememberMe ? styles.checkedBox : styles.uncheckedBox}>
                        {rememberMe && <Icon name="checkmark" size={14} color="#fff" />}
                      </View>
                      <Text style={styles.rememberText}>Remember me</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => alert('Password reset email sent')}>
                      <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSignIn}
                    disabled={isLoading}
                  >
                    <LinearGradient 
                      colors={['#4CAF50', '#2E7D32']} 
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <Text style={styles.buttonText}>Signing In...</Text>
                      ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}

              {/* Or Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="logo-apple" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Switch Form */}
              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Text>
                <TouchableOpacity onPress={toggleForm}>
                  <Text style={styles.switchButton}>
                    {isSignUp ? ' Sign In' : ' Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingLeft: 50,
    paddingRight: 50,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 18,
    zIndex: 1,
  },
  errorText: {
    color: '#ef5350',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#94a3b8',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    color: '#64748b',
  },
  forgotText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#94a3b8',
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    color: '#64748b',
  },
  switchButton: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 5,
  },
   dialogBox: {
    backgroundColor: "#f5f9ff", // Light soft background
    borderRadius: 12,
    elevation: 6, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingBottom: 10,
  },
  dialogText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: "#4a90e2", // Vibrant blue
    borderRadius: 8,
    marginRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});