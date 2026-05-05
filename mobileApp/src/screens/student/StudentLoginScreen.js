import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { studentApi } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentLoginScreen({ navigation }) {
  const [instId, setInstId] = useState('');
  const [universityRollNo, setUniversityRollNo] = useState('');

  const handleLogin = async () => {
    try {
      const response = await studentApi.login({ instId, universityRollNo });
      await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
      navigation.replace('StudentTabs');
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SAM</Text>
      <Text style={styles.subtitle}>Systematic Attendance Manager</Text>
      
      <Text style={styles.welcomeText}>Welcomes You!</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Institute ID :</Text>
        <TextInput 
          style={styles.input} 
          value={instId}
          onChangeText={setInstId}
        />
        
        <Text style={styles.label}>Roll No. :</Text>
        <TextInput 
          style={styles.input} 
          value={universityRollNo}
          onChangeText={setUniversityRollNo}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in as Student</Text>
      </TouchableOpacity>
      
      <Text style={styles.registerText}>
        New User? <Text style={styles.link} onPress={() => navigation.navigate('StudentRegister')}>Register</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 40 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', marginBottom: 30 },
  inputContainer: { width: '80%', marginBottom: 30 },
  label: { fontSize: 14, marginBottom: 5 },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  registerText: { fontSize: 14 },
  link: { color: 'blue', textDecorationLine: 'underline' }
});
