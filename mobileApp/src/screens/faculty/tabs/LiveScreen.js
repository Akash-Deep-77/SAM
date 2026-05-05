import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { sessionApi } from '../../../services/api';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

export default function LiveScreen() {
  const [activeSession, setActiveSession] = useState(null);
  const [isAdvertising, setIsAdvertising] = useState(false);

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      const res = await sessionApi.getFacultyActiveSession();
      if (res.data.data) {
        setActiveSession(res.data.data);
      }
    } catch (e) {
      console.log('Error checking session', e);
    }
  };

  const handleStartSession = async () => {
    try {
      // Hardcoded class and subject IDs for demo purposes, 
      // in reality these would be passed from the "Upcoming" screen
      const classId = '64abcd...'; // Replace with valid ID in db
      const subjectId = '64abcd...';

      const res = await sessionApi.startSession({ classId, subjectId });
      setActiveSession(res.data.data.session);
      
      // Normally we would start BLE advertising here with react-native-ble-peripheral
      // Unfortunately react-native-ble-plx only supports Central role (scanning) out of the box
      // For Advertising, a separate native module like react-native-ble-peripheral is needed
      Alert.alert('Session Started', `BLE Token generated: ${res.data.data.bleToken}\n\nNote: Android BLE Advertising requires native modules.`);
      setIsAdvertising(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start session');
    }
  };

  const handleStopSession = async () => {
    try {
      await sessionApi.endSession(activeSession._id);
      setActiveSession(null);
      setIsAdvertising(false);
      Alert.alert('Session Ended', 'Attendance marking is now closed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to end session');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Live Class</Text>
      
      {activeSession ? (
        <View style={styles.sessionCard}>
          <Text style={styles.activeText}>Session is Active!</Text>
          <Text>BLE Token: {activeSession.BLE_token}</Text>
          <Text>Broadcasting proximity signal...</Text>
          <View style={styles.buttonContainer}>
            <Button title="End Attendance Session" color="red" onPress={handleStopSession} />
          </View>
        </View>
      ) : (
        <View style={styles.sessionCard}>
          <Text>No active session.</Text>
          <View style={styles.buttonContainer}>
            <Button title="Start Attendance Session" onPress={handleStartSession} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  sessionCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  activeText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%'
  }
});
