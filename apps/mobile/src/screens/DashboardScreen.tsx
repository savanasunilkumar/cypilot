import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { DashboardCard } from '../components/DashboardCard';
import { DashboardData } from '@cypilot/shared';

export const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
    isRefreshing,
  } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiService.get<DashboardData>('/api/dashboard'),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>Failed to load dashboard</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {isLoading && !dashboardData ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your data...</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {/* Canvas Card */}
            <DashboardCard
              title="Canvas"
              icon="school"
              color="#E74C3C"
              data={{
                primary: `${dashboardData?.canvas.upcomingAssignments.length || 0} upcoming assignments`,
                secondary: `${dashboardData?.canvas.unreadAnnouncements || 0} unread announcements`,
                courses: dashboardData?.canvas.courses.length || 0,
              }}
              onPress={() => {
                // Navigate to Canvas screen
              }}
            />

            {/* Outlook Card */}
            <DashboardCard
              title="Outlook"
              icon="mail"
              color="#3498DB"
              data={{
                primary: `${dashboardData?.outlook.unreadImportantEmails || 0} important emails`,
                secondary: `${dashboardData?.outlook.upcomingEvents.length || 0} upcoming events`,
                courses: 0,
              }}
              onPress={() => {
                // Navigate to Outlook screen
              }}
            />

            {/* Workday Card */}
            <DashboardCard
              title="Workday"
              icon="briefcase"
              color="#9B59B6"
              data={{
                primary: `${dashboardData?.workday.unreadNotifications || 0} notifications`,
                secondary: `${dashboardData?.workday.actionItems.length || 0} action items`,
                courses: 0,
              }}
              onPress={() => {
                // Navigate to Workday screen
              }}
            />

            {/* CyRide Card */}
            <DashboardCard
              title="CyRide"
              icon="bus"
              color="#F39C12"
              data={{
                primary: `${dashboardData?.cyride.upcomingTrips.length || 0} upcoming trips`,
                secondary: `${dashboardData?.cyride.nearbyStops.length || 0} nearby stops`,
                courses: 0,
              }}
              onPress={() => {
                // Navigate to CyRide screen
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardsContainer: {
    padding: 16,
  },
});
