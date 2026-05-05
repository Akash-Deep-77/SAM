import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { sessionApi, attendanceApi } from '../../../services/api';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

export default function LiveScreen() {
  const [activeSession, setActiveSession] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    checkActiveSession();
    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  const checkActiveSession = async () => {
    try {
      // Hardcoded class ID for demo
      const classId = '64abcd...';
      const res = await sessionApi.getStudentActiveSession(classId);
      if (res.data.data) {
        setActiveSession(res.data.data);
      }
    } catch (e) {
      console.log('Error checking session', e);
    }
  };

  const handleMarkAttendance = () => {
    if (!activeSession) return;
    
    setIsScanning(true);
    Alert.alert('Scanning...', 'Searching for faculty device...');

    // Mock BLE Scan for demonstration purposes
    // In a real scenario, bleManager.startDeviceScan() would look for a specific Service UUID
    // embedded with the BLE token from the faculty's device
    setTimeout(async () => {
      setIsScanning(false);
      try {
        // Here we simulate finding the token (using the activeSession's token)
        const mockFoundBleToken = activeSession.BLE_token;
        
        await attendanceApi.markAttendance({
          bleToken: mockFoundBleToken,
          sessionId: activeSession._id
        });
        
        Alert.alert('Success', 'Attendance marked successfully!');
      } catch (error) {
        Alert.alert('Failed', error.response?.data?.message || 'Could not mark attendance');
      }
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Live Class</Text>
      
      {activeSession ? (
        <View style={styles.sessionCard}>
          <Text style={styles.classText}>Subject: {activeSession.subject?.subjectName || 'Unknown'}</Text>
          <Text>Faculty: {activeSession.facultyStarted?.name || 'Unknown'}</Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title={isScanning ? "Scanning..." : "Mark Attendance (BLE)"} 
              color="#3498db" 
              onPress={handleMarkAttendance} 
              disabled={isScanning}
            />
          </View>
        </View>
      ) : (
        <View style={styles.sessionCard}>
          <Text>No active session found for your class right now.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  sessionCard: { backgroundColor: '#f0f0f0', padding: 20, borderRadius: 10, alignItems: 'center' },
  classText: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  buttonContainer: { marginTop: 20, width: '100%' }
});
