import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../context/AuthContext';
import ReportCard from '../components/ReportCard';
import { analyzeReport } from '../services/gemini';
import { useSelector } from 'react-redux';

const ReportScreen = () => {
  const [report, setReport] = useState();
  const [loading, setLoading] = useState(false);
  const { userRecords } = useContext(AuthContext);
  const mode = useSelector((state) => state.mode.value); // "light" or "dark"

  const handleGenerateReport = async () => {
    if (userRecords.length === 0) {
      alert('No health records available to generate report');
      return;
    }

    setLoading(true);
    try {
      const data = analyzeReport(userRecords[0].bloodPressure);
      setReport(data);
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(mode);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Health Insights</Text>

      {/* Intro Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>AI-Powered Health Analysis</Text>
        <Text style={styles.infoText}>
          Generate personalized health insights based on your health records.
          Our AI will analyze your data and provide recommendations.
        </Text>

        {/* Custom Gradient Button */}
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={handleGenerateReport}
          disabled={loading}
        >
          <LinearGradient
            colors={
              loading
                ? ['#93c5fd', '#60a5fa']
                : mode === 'dark'
                ? ['#38bdf8', '#0ea5e9'] // lighter blue in dark mode
                : ['#3b82f6', '#2563eb'] // deep blue in light mode
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Analyzing...' : 'Generate AI Report'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Loading / Report / Empty State */}
      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color={mode === 'dark' ? '#38bdf8' : '#3b82f6'} />
          <Text style={styles.loadingText}>
            Please wait while we analyze your data...
          </Text>
        </View>
      ) : report ? (
        <Animatable.View animation="fadeInUp" duration={600}>
          <ReportCard report={report} />
        </Animatable.View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            {userRecords.length > 0
              ? "Press 'Generate AI Report' to get insights"
              : "Add health records first to generate a report"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ReportScreen;

// Dynamic styles
const getStyles = (mode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: mode === 'dark' ? '#0f172a' : '#fff',
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: mode === 'dark' ? '#f1f5f9' : '#111827',
    },
    infoCard: {
      backgroundColor: mode === 'dark' ? '#1e293b' : '#eff6ff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: mode === 'dark' ? '#38bdf8' : '#1e3a8a',
      marginBottom: 6,
    },
    infoText: {
      color: mode === 'dark' ? '#cbd5e1' : '#374151',
      lineHeight: 20,
    },
    button: {
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingText: {
      textAlign: 'center',
      marginTop: 10,
      color: mode === 'dark' ? '#94a3b8' : '#4b5563',
    },
    emptyCard: {
      backgroundColor: mode === 'dark' ? '#1e293b' : '#f3f4f6',
      padding: 16,
      borderRadius: 12,
    },
    emptyText: {
      color: mode === 'dark' ? '#94a3b8' : '#6b7280',
      textAlign: 'center',
    },
  });
