import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { apiService } from '../services/api';
import { OutlookEmail, OutlookCalendarEvent } from '@cypilot/shared';

export const OutlookScreen: React.FC = () => {
  const {
    data: importantEmails,
    isLoading: emailsLoading,
    refetch: refetchEmails,
    isRefreshing: emailsRefreshing,
  } = useQuery<OutlookEmail[]>({
    queryKey: ['outlook', 'important-emails'],
    queryFn: () => apiService.get<OutlookEmail[]>('/api/outlook/emails/important'),
  });

  const {
    data: upcomingEvents,
    isLoading: eventsLoading,
    refetch: refetchEvents,
    isRefreshing: eventsRefreshing,
  } = useQuery<OutlookCalendarEvent[]>({
    queryKey: ['outlook', 'upcoming-events'],
    queryFn: () => apiService.get<OutlookCalendarEvent[]>('/api/outlook/events/upcoming'),
  });

  const handleRefresh = () => {
    refetchEmails();
    refetchEvents();
  };

  const isRefreshing = emailsRefreshing || eventsRefreshing;
  const isLoading = emailsLoading || eventsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Important Emails Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Emails</Text>
          {isLoading && !importantEmails ? (
            <Text style={styles.loadingText}>Loading emails...</Text>
          ) : (
            <View style={styles.emailsList}>
              {importantEmails?.map((email) => (
                <View key={email.id} style={styles.emailCard}>
                  <View style={styles.emailHeader}>
                    <Text style={styles.emailSubject}>{email.subject}</Text>
                    {email.importance === 'high' && (
                      <Ionicons name="flag" size={16} color="#FF3B30" />
                    )}
                  </View>
                  <Text style={styles.emailFrom}>
                    From: {email.from.emailAddress.name}
                  </Text>
                  <Text style={styles.emailPreview} numberOfLines={2}>
                    {email.bodyPreview}
                  </Text>
                  <Text style={styles.emailDate}>
                    {new Date(email.receivedDateTime).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {isLoading && !upcomingEvents ? (
            <Text style={styles.loadingText}>Loading events...</Text>
          ) : (
            <View style={styles.eventsList}>
              {upcomingEvents?.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventSubject}>{event.subject}</Text>
                  <View style={styles.eventTime}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.eventTimeText}>
                      {new Date(event.start.dateTime).toLocaleDateString()} at{' '}
                      {new Date(event.start.dateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  {event.location && (
                    <View style={styles.eventLocation}>
                      <Ionicons name="location" size={16} color="#666" />
                      <Text style={styles.eventLocationText}>
                        {event.location.displayName}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  emailsList: {
    gap: 12,
  },
  emailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emailSubject: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emailFrom: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  emailPreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  emailDate: {
    fontSize: 12,
    color: '#999',
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
});
