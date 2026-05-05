import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from './src/screens/WelcomeScreen';
import FacultyLoginScreen from './src/screens/faculty/FacultyLoginScreen';
import StudentLoginScreen from './src/screens/student/StudentLoginScreen';
import FacultyLiveScreen from './src/screens/faculty/tabs/LiveScreen';
import StudentLiveScreen from './src/screens/student/tabs/LiveScreen';
import { View, Text } from 'react-native';

// Placeholder screens for tabs we haven't fully implemented
const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function FacultyTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = 'calendar';
        if (route.name === 'Live') iconName = 'radio';
        if (route.name === 'Me') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3498db',
    })}>
      <Tab.Screen name="Upcoming" children={() => <PlaceholderScreen name="Upcoming Classes" />} />
      <Tab.Screen name="Live" component={FacultyLiveScreen} />
      <Tab.Screen name="Me" children={() => <PlaceholderScreen name="Faculty Profile" />} />
    </Tab.Navigator>
  );
}

function StudentTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = 'calendar';
        if (route.name === 'Live') iconName = 'radio';
        if (route.name === 'Me') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3498db',
    })}>
      <Tab.Screen name="Upcoming" children={() => <PlaceholderScreen name="Upcoming Classes" />} />
      <Tab.Screen name="Live" component={StudentLiveScreen} />
      <Tab.Screen name="Me" children={() => <PlaceholderScreen name="Student Profile" />} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FacultyLogin" component={FacultyLoginScreen} options={{ title: 'Faculty Login' }} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} options={{ title: 'Student Login' }} />
        <Stack.Screen name="FacultyTabs" component={FacultyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="StudentTabs" component={StudentTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
