import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Screens
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecordScreen from './screens/RecordScreen';
import ReportScreen from './screens/ReportScreen';
import AuthScreen from './screens/AuthScreen';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import CustomNavbar from './components/CustomNavbar';

// Store
import store from './store/store.js';
import { userInfo } from './features/userInfo';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Custom dark theme with #0f172a
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f172a',
    card: '#1e293b',   // nav bar / card background
    border: '#334155',
    text: '#ffffff',
    primary: '#4CAF50',
  },
};

// ✅ Custom light theme (optional tweak)
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#f9f9f9',
    border: '#e5e7eb',
    text: '#000000',
    primary: '#388E3C',
  },
};

function TabNavigator() {
  const user = useSelector((state) => state.user.value);
  const mode = useSelector((state) => state.mode.value);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomNavbar user={user} />,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Report') iconName = 'document-text-outline';
          else if (route.name === 'Dashboard') iconName = 'grid';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Record') iconName = 'reader-outline';
          return <Ionicons name={iconName} size={size + 2} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: mode === 'dark' ? '#1e293b' : '#fff',
          borderTopColor: mode === 'dark' ? '#334155' : '#ddd',
          height: 60,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: mode === 'dark' ? '#4CAF50' : '#388E3C',
        tabBarInactiveTintColor: mode === 'dark' ? '#aaa' : 'gray',
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
    </Tab.Navigator>
  );
}

function MainApp() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode.value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:3000/api/user/${token}`);
        if (res.data.success) {
          dispatch(userInfo(res.data.data));
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: mode === 'dark' ? '#0f172a' : '#fff'
      }}>
        <ActivityIndicator size="large" color={mode === 'dark' ? '#4CAF50' : '#388E3C'} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={mode === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </PaperProvider>
    </Provider>
  );
}
