import React, { createContext, useState, useContext, useMemo } from 'react';

// Create context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // User details
  const [user, setUser] = useState({
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2023-01-15T00:00:00.000Z',
  });

  // Health data summary
  const [userHealth, setUserHealth] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    glucose: '98',
    weight: '75',
  });

  // Historical health records
  const [userRecords, setUserRecords] = useState([
    {
      _id: '1',
      date: '2023-10-15T08:30:00.000Z',
      bloodPressure: '118/78',
      heartRate: '70',
      glucose: '95',
      weight: '76',
      notes: 'Feeling great today',
    },
    {
      _id: '2',
      date: '2023-10-14T09:15:00.000Z',
      bloodPressure: '122/82',
      heartRate: '75',
      glucose: '102',
      weight: '76.2',
      notes: 'Slight headache',
    },
  ]);

  // Login simulation
  const login = (credentials) => {
    console.log('Logging in with:', credentials);
    setUser({
      id: 'user123',
      name: 'John Doe',
      email: credentials.email,
      joinDate: '2023-01-15T00:00:00.000Z',
    });
  };

  // Logout
  const logout = () => {
    setUser(null);
    setUserHealth({});
    setUserRecords([]);
  };

  // Add a new health record
  const addRecord = (record) => {
    setUserRecords((prev) => [record, ...prev]);
    // Optionally update latest health data
    setUserHealth({
      bloodPressure: record.bloodPressure,
      heartRate: record.heartRate,
      glucose: record.glucose,
      weight: record.weight,
    });
  };

  // Update health data directly
  const updateHealth = (newData) => {
    setUserHealth((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Memoize context value to avoid re-renders
  const value = useMemo(
    () => ({
      user,
      userHealth,
      userRecords,
      login,
      logout,
      addRecord,
      updateHealth,
    }),
    [user, userHealth, userRecords]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for easy use
export const useAuth = () => useContext(AuthContext);
