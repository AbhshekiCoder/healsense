import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import InputField from '../components/InputField';
import { AuthContext } from '../context/AuthContext';
import { createHealthRecord } from '../services/api';
import { useSelector } from 'react-redux';

const RecordScreen = () => {
  const { userRecords, addRecord } = useContext(AuthContext);
  const mode = useSelector((state) => state.mode.value); // dark | light

  const [newRecord, setNewRecord] = useState({
    bloodPressure: '',
    heartRate: '',
    glucose: '',
    weight: '',
    notes: '',
  });

  const handleInputChange = (field, value) => {
    setNewRecord({ ...newRecord, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const record = {
        ...newRecord,
        date: new Date().toISOString(),
      };

      const response = await createHealthRecord(record);
      addRecord(response.data);

      setNewRecord({
        bloodPressure: '',
        heartRate: '',
        glucose: '',
        weight: '',
        notes: '',
      });

      alert('✅ Record added successfully!');
    } catch (error) {
      console.error('Error adding record:', error);
      alert('❌ Failed to add record');
    }
  };

  const renderRecordItem = ({ item }) => (
    <View
      style={[
        styles.recordItem,
        {
          borderBottomColor: isDark ? '#334155' : '#e5e7eb',
        },
      ]}
    >
      <Text
        style={[
          styles.recordDate,
          { color: isDark ? 'white' : '#111827' },
        ]}
      >
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <View style={styles.recordStats}>
        <Text style={{ color: isDark ? 'white' : '#111827' }}>
          BP: {item.bloodPressure || '--/--'}
        </Text>
        <Text style={{ color: isDark ? 'white' : '#111827' }}>
          HR: {item.heartRate || '--'}
        </Text>
        <Text style={{ color: isDark ? 'white' : '#111827' }}>
          Glucose: {item.glucose || '--'}
        </Text>
        <Text style={{ color: isDark ? 'white' : '#111827' }}>
          Weight: {item.weight || '--'} kg
        </Text>
      </View>
      {item.notes ? (
        <Text
          style={[
            styles.recordNotes,
            { color: isDark ? 'white' : '#4b5563' },
          ]}
        >
          Notes: {item.notes}
        </Text>
      ) : null}
    </View>
  );

  const isDark = mode === 'dark';

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0f172a' : '#f9fafb' },
      ]}
    >
      <Text style={[styles.header, { color: isDark ? '#f8fafc' : '#111827' }]}>
        Health Records
      </Text>

      {/* Add Record Form */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1e293b' : '#ffffff' },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? '#f8fafc' : '#111827' },
          ]}
        >
          Add New Record
        </Text>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <InputField
              label="Blood Pressure"
              value={newRecord.bloodPressure}
              onChangeText={(text) => handleInputChange('bloodPressure', text)}
              placeholder="120/80"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <InputField
              label="Heart Rate"
              value={newRecord.heartRate}
              onChangeText={(text) => handleInputChange('heartRate', text)}
              placeholder="72"
              keyboardType="numeric"
              unit="bpm"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <InputField
              label="Glucose"
              value={newRecord.glucose}
              onChangeText={(text) => handleInputChange('glucose', text)}
              placeholder="100"
              keyboardType="numeric"
              unit="mg/dL"
            />
          </View>
          <View style={styles.halfInput}>
            <InputField
              label="Weight"
              value={newRecord.weight}
              onChangeText={(text) => handleInputChange('weight', text)}
              placeholder="70"
              keyboardType="numeric"
              unit="kg"
            />
          </View>
        </View>

        <InputField
          label="Notes"
          value={newRecord.notes}
          onChangeText={(text) => handleInputChange('notes', text)}
          placeholder="Additional notes..."
        />

        <Button
          title="Add Record"
          onPress={handleSubmit}
          color={isDark ? '#38bdf8' : '#2563eb'}
        />
      </View>

      {/* History */}
      <Text
        style={[
          styles.subHeader,
          { color: isDark ? '#f1f5f9' : '#111827' },
        ]}
      >
        History
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1e293b' : '#ffffff' },
        ]}
      >
        <FlatList
          data={userRecords}
          renderItem={renderRecordItem}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
        />
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
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  recordItem: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  recordDate: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  recordNotes: {
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default RecordScreen;
