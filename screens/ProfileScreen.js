import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userInfo } from '../features/userInfo';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.value);
  const mode = useSelector((state) => state.mode.value); // light | dark

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(userInfo(null));
    navigation.navigate('auth');
  };

  const isDark = mode === 'dark';

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0f172a' : '#f9fafb' },
      ]}
    >
      <Text style={[styles.header, { color: isDark ? '#ffffff' : '#111827' }]}>
        Your Profile
      </Text>

      {/* Profile Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1e293b' : '#ffffff' },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDark ? '#334155' : '#e5e7eb',
                borderColor: isDark ? '#38bdf8' : '#3b82f6',
              },
            ]}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>
            Name
          </Text>
          <Text style={[styles.value, { color: isDark ? '#f8fafc' : '#111827' }]}>
            {user?.name || 'User Name'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>
            Email
          </Text>
          <Text style={[styles.value, { color: isDark ? '#f8fafc' : '#111827' }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#6b7280' }]}>
            Member Since
          </Text>
          <Text style={[styles.value, { color: isDark ? '#f8fafc' : '#111827' }]}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'Jan 2023'}
          </Text>
        </View>

        <Button
          title="Edit Profile"
          onPress={() => alert('Edit profile functionality')}
          color={isDark ? '#38bdf8' : '#2563eb'}
        />
      </View>

      {/* Account Settings */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1e293b' : '#ffffff' },
        ]}
      >
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          Account Settings
        </Text>

        <View style={styles.buttonSpacing}>
          <Button
            title="Notification Preferences"
            onPress={() => alert('Notification settings')}
            color={isDark ? '#38bdf8' : '#2563eb'}
          />
        </View>

        <View style={styles.buttonSpacing}>
          <Button
            title="Data Backup Settings"
            onPress={() => alert('Backup settings')}
            color={isDark ? '#38bdf8' : '#2563eb'}
          />
        </View>

        <Button
          title="Privacy & Security"
          onPress={() => alert('Privacy settings')}
          color={isDark ? '#38bdf8' : '#2563eb'}
        />
      </View>

      {/* Actions */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1e293b' : '#ffffff' },
        ]}
      >
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
          Actions
        </Text>

        <View style={styles.buttonSpacing}>
          <Button
            title="Export Health Data"
            onPress={() => alert('Data export functionality')}
            color={isDark ? '#38bdf8' : '#2563eb'}
          />
        </View>

        <Button title="Log Out" onPress={logout} color="#ef4444" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
});

export default ProfileScreen;
