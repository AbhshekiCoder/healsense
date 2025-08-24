import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const HealthChart = ({ data, title, mode }) => {
  const screenWidth = Dimensions.get('window').width;

  // dynamic styles based on mode
  const isDark = mode === "dark";
  const dynamicStyles = StyleSheet.create({
    container: {
      marginVertical: 16,
      alignItems: 'center',
      backgroundColor: isDark ? '#0f172a' : 'white',
      paddingVertical: 8,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      color: isDark ? '#ffffff' : '#0f172a',
    },
    chart: {
      borderRadius: 16,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {title && <Text style={dynamicStyles.title}>{title}</Text>}
      <LineChart
        data={{
          labels: data.labels,
          datasets: [{ data: data.values }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix={` ${data.unit || ''}`}
        chartConfig={{
          backgroundColor: isDark ? '#0f172a' : 'white',
          backgroundGradientFrom: isDark ? '#0f172a' : 'white',
          backgroundGradientTo: isDark ? '#0f172a' : 'white',
          decimalPlaces: 1,
          color: (opacity = 1) =>
            isDark
              ? `rgba(96, 165, 250, ${opacity})` // blue for dark
              : `rgba(37, 99, 235, ${opacity})`, // darker blue for light
          labelColor: (opacity = 1) =>
            isDark
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#38bdf8',
          },
        }}
        bezier
        style={dynamicStyles.chart}
      />
    </View>
  );
};

export default HealthChart;
