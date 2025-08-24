import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

// Theme Colors
const theme = {
  light: {
    background: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a",
    subtext: "#64748b",
    border: "#e2e8f0"
  },
  dark: {
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    subtext: "#94a3b8",
    border: "#334155"
  }
};

export default function HomeScreen({ navigation }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const user = useSelector((state) => state.user.value);
  const mode = useSelector((state) => state.mode.value); // light | dark
  const colors = theme[mode]; // 👈 dynamic colors

  const [greeting, setGreeting] = useState();
  useEffect(() => {
    const data = () => {
      let date = new Date();
      let hour = date.getHours();
      if (hour >= 0 && hour < 12) {
        setGreeting('Good Morning 🌅')
      } else if (hour >= 12 && hour < 16) {
        setGreeting('Good Afternoon ☀️');
      } else if (hour >= 16 && hour < 21) {
        setGreeting('Good Evening 🌆')
      } else {
        setGreeting('Good Night 🌙')
      }
    }
    data();
    const interval = setInterval(data, 3600000);
    return () => clearInterval(interval);
  }, [])

  const quotes = [
    "Your health is your greatest wealth.",
    "A healthy outside starts from the inside.",
    "Check your health today for a better tomorrow.",
    "Prevention is better than cure."
  ];

  const images = [
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581595219316-5e6f9e7b0e19?auto=format&fit=crop&w=1200&q=80"
  ];

  const healthCards = [
    {
      id: 1,
      title: "Blood Pressure",
      value: "118/78",
      unit: "mmHg",
      status: "Normal",
      icon: "heart-outline",
      color: "#4CAF50",
      onPress: () => navigation.navigate("BloodPressure")
    },
    {
      id: 2,
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "Good",
      icon: "pulse-outline",
      color: "#E91E63",
      onPress: () => navigation.navigate("HeartRate")
    }
  ];

  const quickActions = [
    { id: 1, title: "Start Checkup", icon: "medkit-outline", color: "#4CAF50", onPress: () => navigation.navigate("Checkup") },
    { id: 2, title: "Health Tips", icon: "heart-outline", color: "#E91E63", onPress: () => navigation.navigate("Tips") },
    { id: 3, title: "Appointments", icon: "calendar-outline", color: "#2196F3", onPress: () => navigation.navigate("Appointments") },
    { id: 4, title: "Medical History", icon: "document-text-outline", color: "#FF9800", onPress: () => navigation.navigate("History") },
  ];

  const healthTips = [
    "Drink at least 8 glasses of water daily",
    "Get 7-8 hours of sleep each night",
    "Walk 30 minutes every day for better health",
    "Reduce sugar intake for better heart health"
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {user ? greeting ? <Text style={[styles.greeting, { color: colors.subtext }]}>{greeting}</Text> : '' : 'Hi'}
            <Text style={[styles.userName, { color: colors.text }]}>{user ? user.name : ''}</Text>
          </View>
          <TouchableOpacity style={[styles.profileButton, { borderColor: colors.border }]}> 
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Health Stats Cards */}
        <View style={styles.statsContainer}>
          {healthCards.map(card => (
            <TouchableOpacity 
              key={card.id}
              style={[styles.statsCard, { borderLeftColor: card.color, backgroundColor: colors.card, shadowColor: colors.text }]}
              onPress={card.onPress}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
                <Icon name={card.icon} size={24} color={card.color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardValue, { color: colors.text }]}>{card.value}</Text>
                <Text style={[styles.cardUnit, { color: colors.subtext }]}>{card.unit}</Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: `${card.color}20` }]}>
                  <Text style={[styles.statusText, { color: card.color }]}>{card.status}</Text>
                </View>
                <Text style={[styles.cardTime, { color: colors.subtext }]}>Last: Today</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          <Swiper 
            autoplay 
            autoplayTimeout={5}
            showsPagination={true}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
            onIndexChanged={index => setActiveSlide(index)}
          >
            {images.map((img, index) => (
              <View key={index} style={styles.slide}>
                <Image source={{ uri: img }} style={styles.sliderImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.gradientOverlay}
                />
                <View style={styles.slideContent}>
                  <Text style={styles.slideTitle}>Health Awareness</Text>
                  <Text style={styles.slideText}>
                    {index === 0 ? "Regular checkups can prevent health issues" : 
                     index === 1 ? "Proper nutrition is key to longevity" : 
                     "Exercise improves both physical and mental health"}
                  </Text>
                </View>
              </View>
            ))}
          </Swiper>
        </View>

        {/* Quote Section */}
        <View style={[styles.quoteBox, { backgroundColor: colors.card, borderLeftColor: "#4CAF50", shadowColor: colors.text }]}> 
          <MaterialCommunityIcons name="format-quote-open" size={24} color="#4CAF50" style={styles.quoteIcon} />
          <Text style={[styles.quoteText, { color: colors.text }]}>{quotes[Math.floor(Math.random() * quotes.length)]}</Text>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity 
              key={action.id}
              style={[styles.actionCard, { backgroundColor: colors.card, shadowColor: colors.text }]} 
              onPress={action.onPress}
            >
              <LinearGradient
                colors={[`${action.color}10`, `${action.color}30`]}
                style={[styles.actionIconContainer, { borderColor: `${action.color}50` }]}
              >
                <Icon name={action.icon} size={32} color={action.color} />
              </LinearGradient>
              <Text style={[styles.actionText, { color: colors.text }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Tips */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Health Tips</Text>
        <View style={styles.tipsContainer}>
          {healthTips.map((tip, index) => (
            <View key={index} style={[styles.tipCard, { backgroundColor: colors.card, shadowColor: colors.text }]}>
              <View style={[styles.tipNumber, { backgroundColor: colors.border }]}> 
                <Text style={[styles.tipNumberText, { color: colors.subtext }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 18 },
  userName: { fontSize: 24, fontWeight: "bold" },
  profileButton: { width: 48, height: 48, borderRadius: 24, overflow: "hidden", borderWidth: 2 },
  profileImage: { width: "100%", height: "100%" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  statsCard: { borderRadius: 16, padding: 16, width: width / 2.2, borderLeftWidth: 4, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardBody: { flexDirection: "row", alignItems: "baseline", marginBottom: 12 },
  cardValue: { fontSize: 28, fontWeight: "700", marginRight: 6 },
  cardUnit: { fontSize: 16 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "600" },
  cardTime: { fontSize: 12 },
  sliderContainer: { height: 200, borderRadius: 16, overflow: "hidden", marginBottom: 24 },
  slide: { flex: 1, position: "relative" },
  sliderImage: { width: "100%", height: "100%" },
  gradientOverlay: { position: "absolute", left: 0, right: 0, bottom: 0, height: "60%" },
  slideContent: { position: "absolute", bottom: 20, left: 20, right: 20 },
  slideTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 6 },
  slideText: { fontSize: 14, color: "#e2e8f0" },
  dotStyle: { backgroundColor: "rgba(255,255,255,0.4)", width: 8, height: 8, borderRadius: 4, margin: 3 },
  activeDotStyle: { backgroundColor: "#fff", width: 10, height: 10, borderRadius: 5, margin: 3 },
  quoteBox: { borderRadius: 16, padding: 20, marginBottom: 24, elevation: 1, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, borderLeftWidth: 4 },
  quoteIcon: { marginBottom: 8 },
  quoteText: { fontSize: 16, fontStyle: "italic", lineHeight: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  actionCard: { width: width / 2.2, borderRadius: 16, padding: 16, alignItems: "center", marginBottom: 16, elevation: 1, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  actionIconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", marginBottom: 12, borderWidth: 1 },
  actionText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  tipsContainer: { marginBottom: 24 },
  tipCard: { borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 12, elevation: 1, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  tipNumber: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 16 },
  tipNumberText: { fontSize: 16, fontWeight: "700" },
  tipText: { fontSize: 14, flex: 1 },
});
