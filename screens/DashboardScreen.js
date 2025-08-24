import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import HealthChart from '../components/HealthChart';
import { AuthContext } from '../context/AuthContext';

const DashboardScreen = () => {
  const { userHealth } = useContext(AuthContext);
  const mode = useSelector((state) => state.mode.value); // 👈 grab dark/light mode

  const bloodPressureData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [120, 122, 119, 118, 121, 123, 120],
    unit: 'mmHg',
  };

  const heartRateData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [72, 75, 70, 68, 73, 74, 71],
    unit: 'bpm',
  };

  // 👇 conditional styles based on mode
  const themedStyles = styles(mode);

  return (
    <ScrollView style={themedStyles.container}>
      <Text style={themedStyles.title}>Health Dashboard</Text>

      <View style={themedStyles.summaryCard}>
        <Text style={themedStyles.summaryTitle}>Today's Summary</Text>
        <View style={themedStyles.summaryRow}>
          <View style={themedStyles.summaryItem}>
            <Text style={themedStyles.summaryValue}>{userHealth?.bloodPressure || '--/--'}</Text>
            <Text style={themedStyles.summaryLabel}>BP</Text>
          </View>
          <View style={themedStyles.summaryItem}>
            <Text style={themedStyles.summaryValue}>{userHealth?.heartRate || '--'}</Text>
            <Text style={themedStyles.summaryLabel}>Heart Rate</Text>
          </View>
          <View style={themedStyles.summaryItem}>
            <Text style={themedStyles.summaryValue}>{userHealth?.glucose || '--'}</Text>
            <Text style={themedStyles.summaryLabel}>Glucose</Text>
          </View>
        </View>
      </View>

      <View style={themedStyles.chartBlock}>
        <Text style={themedStyles.chartTitle}>Blood Pressure Trend</Text>
        <HealthChart data={bloodPressureData} title={'BP trend'} mode={mode} />
        <Text style={themedStyles.chartTitle}>Heart Rate Trend</Text>
        <HealthChart data={heartRateData} title={'Heart Rate trend'} mode={mode} />
      </View>
    </ScrollView>
  );
};

// 🎨 dynamic theme-aware styles
const styles = (mode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: mode === 'dark' ? '#0f172a' : '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: mode === 'dark' ? '#f8fafc' : '#111',
    },
    summaryCard: {
      backgroundColor: mode === 'dark' ? '#1e293b' : '#e0f2fe',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#38bdf8' : '#1e40af',
      marginBottom: 8,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    summaryItem: { alignItems: 'center' },
    summaryValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#f1f5f9' : '#111',
    },
    summaryLabel: {
      color: mode === 'dark' ? '#94a3b8' : '#4b5563',
    },
    chartBlock: { marginBottom: 16 },
    chartTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: mode === 'dark' ? '#f8fafc' : '#111',
    },
  });

export default DashboardScreen;
