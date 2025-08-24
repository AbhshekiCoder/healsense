import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const ReportCard = ({ report }) => {
  const mode = useSelector((state) => state.mode.value); // "light" or "dark"

  if (!report) return null;

  const styles = getStyles(mode);

  return (
    <View style={styles.card}>
      <Text style={styles.header}>AI Health Analysis</Text>
      <Text style={styles.normalText}>
        {report}
      </Text>
    </View>
  );
};

// Dynamic styles based on Redux theme mode
const getStyles = (mode) =>
  StyleSheet.create({
    card: {
      marginTop: 20,
      padding: 18,
      backgroundColor: mode === 'dark' ? '#0f172a' : '#f9fafb', // dark / light bg
      borderRadius: 14,
      borderWidth: 1,
      borderColor: mode === 'dark' ? '#1e293b' : '#e5e7eb',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    header: {
      fontSize: 22,
      fontWeight: '700',
      color: mode === 'dark' ? '#38bdf8' : '#1e40af', // cyan on dark, blue on light
      marginBottom: 12,
    },
    sectionHeading: {
      fontSize: 16,
      fontWeight: '600',
      color: mode === 'dark' ? '#60a5fa' : '#2563eb',
      marginTop: 14,
      marginBottom: 6,
    },
    bulletSection: {
      marginTop: 6,
      marginBottom: 10,
    },
    bulletText: {
      fontSize: 15,
      color: mode === 'dark' ? '#cbd5e1' : '#374151', // gray-300 vs gray-700
      marginBottom: 5,
    },
    normalText: {
      fontSize: 15,
      color: mode === 'dark' ? '#e2e8f0' : '#374151', // light gray vs dark gray
      lineHeight: 22,
      marginBottom: 8,
    },
  });

export default ReportCard;
