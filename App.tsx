import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LibraryScreen from './src/screens/LibraryScreen';
import SessionsScreen from './src/screens/SessionsScreen';
import CreateDrillScreen from './src/screens/CreateDrillScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: 'white',
            tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#333' },
            tabBarActiveTintColor: '#6fbf4a',
            tabBarInactiveTintColor: '#888',
          }}
        >
          <Tab.Screen 
            name="Library" 
            component={LibraryScreen}
            options={{ title: 'Drill Library' }}
          />
          <Tab.Screen 
            name="Sessions" 
            component={SessionsScreen}
          />
          <Tab.Screen 
            name="Create" 
            component={CreateDrillScreen}
            options={{ title: 'Create Drill' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}