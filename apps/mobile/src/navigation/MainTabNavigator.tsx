import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { DashboardScreen } from '../screens/DashboardScreen';
import { CanvasScreen } from '../screens/CanvasScreen';
import { OutlookScreen } from '../screens/OutlookScreen';
import { WorkdayScreen } from '../screens/WorkdayScreen';
import { CyRideScreen } from '../screens/CyRideScreen';

const Tab = createBottomTabNavigator();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Canvas':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Outlook':
              iconName = focused ? 'mail' : 'mail-outline';
              break;
            case 'Workday':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'CyRide':
              iconName = focused ? 'bus' : 'bus-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Canvas" 
        component={CanvasScreen}
        options={{ title: 'Canvas' }}
      />
      <Tab.Screen 
        name="Outlook" 
        component={OutlookScreen}
        options={{ title: 'Outlook' }}
      />
      <Tab.Screen 
        name="Workday" 
        component={WorkdayScreen}
        options={{ title: 'Workday' }}
      />
      <Tab.Screen 
        name="CyRide" 
        component={CyRideScreen}
        options={{ title: 'CyRide' }}
      />
    </Tab.Navigator>
  );
};
