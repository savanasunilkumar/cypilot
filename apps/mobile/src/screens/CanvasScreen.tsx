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
import { CanvasCourse, CanvasAssignment } from '@cypilot/shared';

export const CanvasScreen: React.FC = () => {
  const {
    data: courses,
    isLoading: coursesLoading,
    refetch: refetchCourses,
    isRefreshing: coursesRefreshing,
  } = useQuery<CanvasCourse[]>({
    queryKey: ['canvas', 'courses'],
    queryFn: () => apiService.get<CanvasCourse[]>('/api/canvas/courses'),
  });

  const {
    data: upcomingAssignments,
    isLoading: assignmentsLoading,
    refetch: refetchAssignments,
    isRefreshing: assignmentsRefreshing,
  } = useQuery<CanvasAssignment[]>({
    queryKey: ['canvas', 'upcoming-assignments'],
    queryFn: () => apiService.get<CanvasAssignment[]>('/api/canvas/assignments/upcoming'),
  });

  const handleRefresh = () => {
    refetchCourses();
    refetchAssignments();
  };

  const isRefreshing = coursesRefreshing || assignmentsRefreshing;
  const isLoading = coursesLoading || assignmentsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          {isLoading && !courses ? (
            <Text style={styles.loadingText}>Loading courses...</Text>
          ) : (
            <View style={styles.coursesList}>
              {courses?.map((course) => (
                <View key={course.id} style={styles.courseCard}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseCode}>{course.courseCode}</Text>
                  <Text style={styles.courseTerm}>{course.term}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Upcoming Assignments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          {isLoading && !upcomingAssignments ? (
            <Text style={styles.loadingText}>Loading assignments...</Text>
          ) : (
            <View style={styles.assignmentsList}>
              {upcomingAssignments?.map((assignment) => (
                <View key={assignment.id} style={styles.assignmentCard}>
                  <Text style={styles.assignmentName}>{assignment.name}</Text>
                  <Text style={styles.assignmentCourse}>
                    Course ID: {assignment.courseId}
                  </Text>
                  {assignment.dueAt && (
                    <Text style={styles.assignmentDue}>
                      Due: {new Date(assignment.dueAt).toLocaleDateString()}
                    </Text>
                  )}
                  <Text style={styles.assignmentPoints}>
                    {assignment.pointsPossible} points
                  </Text>
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
  coursesList: {
    gap: 12,
  },
  courseCard: {
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
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  courseTerm: {
    fontSize: 12,
    color: '#666',
  },
  assignmentsList: {
    gap: 12,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  assignmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  assignmentCourse: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  assignmentDue: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
    marginBottom: 2,
  },
  assignmentPoints: {
    fontSize: 12,
    color: '#666',
  },
});
