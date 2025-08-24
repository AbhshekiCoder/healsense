import React from "react";
import { TextInput, View, Text, StyleSheet, useColorScheme } from "react-native";
import { useSelector } from "react-redux";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  unit,
  secureTextEntry = false,
}) => {
  const mode = useSelector((state) => state.mode.value) // detect light/dark mode
  const isDark = mode === "dark";

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>}

      <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
        {unit && <Text style={[styles.unit, isDark && styles.unitDark]}>{unit}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "#374151", // gray-700
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 15,
  },
  labelDark: {
    color: "#E5E7EB", // gray-200
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB", // gray-50
  },
  inputWrapperDark: {
    backgroundColor: "#0f172a", // slate-900
    borderColor: "#334155", // slate-700
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827", // gray-900
  },
  inputDark: {
    color: "#F9FAFB", // light text
  },
  unit: {
    color: "#6B7280", // gray-500
    marginLeft: 8,
    fontWeight: "500",
  },
  unitDark: {
    color: "#9CA3AF", // gray-400
  },
});

export default InputField;
