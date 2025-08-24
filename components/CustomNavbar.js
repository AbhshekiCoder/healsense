// components/CustomNavbar.js
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userInfo } from '../features/userInfo';
import { changeMode } from '../features/mode';

const CustomNavbar = ({ user }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux state for mode
  const mode = useSelector((state) => state.mode.value);

  let logout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch(userInfo(null));
    navigation.navigate('auth');
  };

  // Theme styles based on Redux mode
  const themeStyles = mode === "dark" ? darkTheme : lightTheme;

  // Toggle dark/light
  const toggleMode = async() => {
    dispatch(changeMode(mode === "dark" ? "light" : "dark"));
    await AsyncStorage.setItem("mode", mode == 'dark'?'light':'dark' );
  };

  return (
    <View style={[styles.navbar, { backgroundColor: themeStyles.navbarBg, shadowColor: themeStyles.shadow }]}>
      {/* Left - Logo */}
      <View style={styles.left}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Right Side */}
      <View style={styles.rightContainer}>
        {/* Toggle Dark/Light Mode */}
        <Pressable
          onPress={toggleMode}
          style={({ pressed }) => [
            styles.toggleButton,
            pressed && { opacity: 0.7 },
            { backgroundColor: themeStyles.buttonBg }
          ]}
        >
          <Entypo
            name={mode === "dark" ? "moon" : "light-up"}
            size={20}
            color={themeStyles.text}
          />
          <Text style={[styles.toggleText, { color: themeStyles.text }]}>
            {mode === "dark" ? "Dark" : "Light"}
          </Text>
        </Pressable>

        {/* Login/Logout */}
        {user ? (
          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && { opacity: 0.7 },
              { backgroundColor: themeStyles.buttonBg }
            ]}
          >
            <Entypo name="log-out" size={20} color={themeStyles.text} />
            <Text style={[styles.loginText, { color: themeStyles.text }]}>
              Logout
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => navigation.navigate('auth')}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && { opacity: 0.7 },
              { backgroundColor: themeStyles.buttonBg }
            ]}
          >
            <Entypo name="login" size={20} color={themeStyles.text} />
            <Text style={[styles.loginText, { color: themeStyles.text }]}>
              Login
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

// Light and Dark Theme styles (sync with HomeScreen theme)
const lightTheme = {
  navbarBg: '#ffffff',
  text: '#000',
  buttonBg: '#388E3C',
  shadow: '#ccc',
};

const darkTheme = {
  navbarBg: '#0f172a',
  text: '#fff',
  buttonBg: '#444',
  shadow: '#000',
};

const styles = StyleSheet.create({
  navbar: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 140,
    height: 50,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginLeft: 10,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default CustomNavbar;
