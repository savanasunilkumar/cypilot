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
import { WorkdayNotification, WorkdayActionItem, TuitionFee, StudentRecord } from '@cypilot/shared';

export const WorkdayScreen: React.FC = () => {
  const {
    data: notifications,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
    isRefreshing: notificationsRefreshing,
  } = useQuery<WorkdayNotification[]>({
    queryKey: ['workday', 'notifications'],
    queryFn: () => apiService.get<WorkdayNotification[]>('/api/workday/notifications'),
  });

  const {
    data: actionItems,
    isLoading: actionItemsLoading,
    refetch: refetchActionItems,
    isRefreshing: actionItemsRefreshing,
  } = useQuery<WorkdayActionItem[]>({
    queryKey: ['workday', 'action-items'],
    queryFn: () => apiService.get<WorkdayActionItem[]>('/api/workday/action-items'),
  });

  const {
    data: tuitionFees,
    isLoading: tuitionFeesLoading,
    refetch: refetchTuitionFees,
    isRefreshing: tuitionFeesRefreshing,
  } = useQuery<TuitionFee[]>({
    queryKey: ['workday', 'tuition-fees'],
    queryFn: () => apiService.get<TuitionFee[]>('/api/workday/tuition-fees'),
  });

  const {
    data: studentRecord,
    isLoading: studentRecordLoading,
    refetch: refetchStudentRecord,
    isRefreshing: studentRecordRefreshing,
  } = useQuery<StudentRecord>({
    queryKey: ['workday', 'student-record'],
    queryFn: () => apiService.get<StudentRecord>('/api/workday/student-record'),
  });

  const handleRefresh = () => {
    refetchNotifications();
    refetchActionItems();
    refetchTuitionFees();
    refetchStudentRecord();
  };

  const isRefreshing = notificationsRefreshing || actionItemsRefreshing || tuitionFeesRefreshing || studentRecordRefreshing;
  const isLoading = notificationsLoading || actionItemsLoading || tuitionFeesLoading || studentRecordLoading;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Student Record Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          {isLoading && !studentRecord ? (
            <Text style={styles.loadingText}>Loading student record...</Text>
          ) : (
            <View style={styles.studentCard}>
              <Text style={styles.studentName}>{studentRecord?.name}</Text>
              <Text style={styles.studentId}>ID: {studentRecord?.studentId}</Text>
              <Text style={styles.studentMajor}>{studentRecord?.major}</Text>
              <Text style={styles.studentStatus}>
                Status: {studentRecord?.enrollmentStatus} • {studentRecord?.academicLevel}
              </Text>
              {studentRecord?.gpa && (
                <Text style={styles.studentGPA}>GPA: {studentRecord.gpa}</Text>
              )}
            </View>
          )}
        </View>

        {/* Tuition Fees Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tuition & Fees</Text>
          {isLoading && !tuitionFees ? (
            <Text style={styles.loadingText}>Loading tuition fees...</Text>
          ) : (
            <View style={styles.feesList}>
              {tuitionFees?.map((fee, index) => (
                <View key={index} style={styles.feeCard}>
                  <View style={styles.feeHeader}>
                    <Text style={styles.feeTerm}>{fee.term}</Text>
                    <Text style={[styles.feeStatus, styles[`status${fee.status}`]]}>
                      {fee.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.feeDescription}>{fee.description}</Text>
                  <Text style={styles.feeAmount}>${fee.amount.toFixed(2)}</Text>
                  <Text style={styles.feeDueDate}>
                    Due: {new Date(fee.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {isLoading && !notifications ? (
            <Text style={styles.loadingText}>Loading notifications...</Text>
          ) : (
            <View style={styles.notificationsList}>
              {notifications?.map((notification) => (
                <View key={notification.id} style={styles.notificationCard}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <View style={[styles.notificationBadge, styles[`type${notification.type}`]]}>
                      <Text style={styles.notificationBadgeText}>
                        {notification.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationDate}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Action Items</Text>
          {isLoading && !actionItems ? (
            <Text style={styles.loadingText}>Loading action items...</Text>
          ) : (
            <View style={styles.actionItemsList}>
              {actionItems?.map((item) => (
                <View key={item.id} style={styles.actionItemCard}>
                  <View style={styles.actionItemHeader}>
                    <Text style={styles.actionItemTitle}>{item.title}</Text>
                    <View style={[styles.actionItemBadge, styles[`status${item.status}`]]}>
                      <Text style={styles.actionItemBadgeText}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.actionItemDescription}>{item.description}</Text>
                  {item.dueDate && (
                    <Text style={styles.actionItemDue}>
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </Text>
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
  studentCard: {
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
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  studentMajor: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  studentStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  studentGPA: {
    fontSize: 14,
    color: '#666',
  },
  feesList: {
    gap: 12,
  },
  feeCard: {
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
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeTerm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  feeStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statuspending: {
    backgroundColor: '#FFE5B4',
    color: '#FF8C00',
  },
  statuspaid: {
    backgroundColor: '#D4EDDA',
    color: '#28A745',
  },
  statusoverdue: {
    backgroundColor: '#F8D7DA',
    color: '#DC3545',
  },
  feeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  feeDueDate: {
    fontSize: 12,
    color: '#999',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
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
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  typeinfo: {
    backgroundColor: '#3498DB',
  },
  typewarning: {
    backgroundColor: '#F39C12',
  },
  typeerror: {
    backgroundColor: '#E74C3C',
  },
  typesuccess: {
    backgroundColor: '#27AE60',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  actionItemsList: {
    gap: 12,
  },
  actionItemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionItemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionItemBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  statuspending: {
    backgroundColor: '#FFE5B4',
    color: '#FF8C00',
  },
  statusin_progress: {
    backgroundColor: '#3498DB',
  },
  statuscompleted: {
    backgroundColor: '#27AE60',
  },
  statusoverdue: {
    backgroundColor: '#E74C3C',
  },
  actionItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  actionItemDue: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
  },
});
