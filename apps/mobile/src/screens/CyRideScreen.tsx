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
import { CyRideRoute, CyRideStop, CyRideTrip } from '@cypilot/shared';

export const CyRideScreen: React.FC = () => {
  const {
    data: routes,
    isLoading: routesLoading,
    refetch: refetchRoutes,
    isRefreshing: routesRefreshing,
  } = useQuery<CyRideRoute[]>({
    queryKey: ['cyride', 'routes'],
    queryFn: () => apiService.get<CyRideRoute[]>('/api/cyride/routes'),
  });

  const {
    data: nearbyStops,
    isLoading: stopsLoading,
    refetch: refetchStops,
    isRefreshing: stopsRefreshing,
  } = useQuery<CyRideStop[]>({
    queryKey: ['cyride', 'nearby-stops'],
    queryFn: () => apiService.get<CyRideStop[]>('/api/cyride/stops/nearby'),
  });

  const {
    data: upcomingTrips,
    isLoading: tripsLoading,
    refetch: refetchTrips,
    isRefreshing: tripsRefreshing,
  } = useQuery<CyRideTrip[]>({
    queryKey: ['cyride', 'upcoming-trips'],
    queryFn: () => apiService.get<CyRideTrip[]>('/api/cyride/trips/upcoming'),
  });

  const handleRefresh = () => {
    refetchRoutes();
    refetchStops();
    refetchTrips();
  };

  const isRefreshing = routesRefreshing || stopsRefreshing || tripsRefreshing;
  const isLoading = routesLoading || stopsLoading || tripsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Routes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Routes</Text>
          {isLoading && !routes ? (
            <Text style={styles.loadingText}>Loading routes...</Text>
          ) : (
            <View style={styles.routesList}>
              {routes?.map((route) => (
                <View key={route.id} style={styles.routeCard}>
                  <View style={[styles.routeColorBar, { backgroundColor: route.color }]} />
                  <View style={styles.routeContent}>
                    <View style={styles.routeHeader}>
                      <Text style={styles.routeName}>{route.name}</Text>
                      <View style={[styles.statusBadge, route.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                        <Text style={styles.statusText}>{route.status.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.routeDescription}>{route.description}</Text>
                    <Text style={styles.routeType}>{route.type.toUpperCase()}</Text>
                    <View style={styles.routeSchedule}>
                      <Ionicons name="time" size={14} color="#666" />
                      <Text style={styles.routeScheduleText}>
                        {route.firstTrip} - {route.lastTrip}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Nearby Stops Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Stops</Text>
          {isLoading && !nearbyStops ? (
            <Text style={styles.loadingText}>Loading stops...</Text>
          ) : (
            <View style={styles.stopsList}>
              {nearbyStops?.map((stop) => (
                <View key={stop.id} style={styles.stopCard}>
                  <View style={styles.stopHeader}>
                    <Text style={styles.stopName}>{stop.name}</Text>
                    <View style={styles.stopFeatures}>
                      {stop.accessible && (
                        <Ionicons name="accessibility" size={16} color="#27AE60" />
                      )}
                      {stop.shelter && (
                        <Ionicons name="home" size={16} color="#3498DB" />
                      )}
                    </View>
                  </View>
                  {stop.description && (
                    <Text style={styles.stopDescription}>{stop.description}</Text>
                  )}
                  <Text style={styles.stopRoutes}>
                    Routes: {stop.routes.join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Upcoming Trips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          {isLoading && !upcomingTrips ? (
            <Text style={styles.loadingText}>Loading trips...</Text>
          ) : (
            <View style={styles.tripsList}>
              {upcomingTrips?.map((trip) => (
                <View key={trip.id} style={styles.tripCard}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripRoute}>Route {trip.routeId}</Text>
                    <View style={[styles.statusBadge, styles[`status${trip.status}`]]}>
                      <Text style={styles.statusText}>{trip.status.replace('_', ' ').toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.tripTime}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.tripTimeText}>
                      {new Date(trip.scheduledArrival).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    {trip.predictedArrival && (
                      <Text style={styles.tripPredicted}>
                        (Predicted: {new Date(trip.predictedArrival).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })})
                      </Text>
                    )}
                  </View>
                  {trip.delay !== undefined && (
                    <Text style={[styles.tripDelay, trip.delay > 0 ? styles.delayLate : styles.delayEarly]}>
                      {trip.delay > 0 ? `+${trip.delay} min late` : `${Math.abs(trip.delay)} min early`}
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
  routesList: {
    gap: 12,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  routeColorBar: {
    height: 4,
    width: '100%',
  },
  routeContent: {
    padding: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#D4EDDA',
  },
  statusInactive: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  routeType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  routeSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeScheduleText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  stopsList: {
    gap: 12,
  },
  stopCard: {
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
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  stopFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  stopDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stopRoutes: {
    fontSize: 12,
    color: '#007AFF',
  },
  tripsList: {
    gap: 12,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statuson_time: {
    backgroundColor: '#D4EDDA',
  },
  statusdelayed: {
    backgroundColor: '#F8D7DA',
  },
  statusearly: {
    backgroundColor: '#D1ECF1',
  },
  statuscancelled: {
    backgroundColor: '#F8D7DA',
  },
  tripTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripTimeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  tripPredicted: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  tripDelay: {
    fontSize: 12,
    fontWeight: '500',
  },
  delayLate: {
    color: '#E74C3C',
  },
  delayEarly: {
    color: '#27AE60',
  },
});
