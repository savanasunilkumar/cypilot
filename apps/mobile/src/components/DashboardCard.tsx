import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DashboardCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  data: {
    primary: string;
    secondary: string;
    courses?: number;
  };
  onPress: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  color,
  data,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="#fff" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.primaryText}>{data.primary}</Text>
        <Text style={styles.secondaryText}>{data.secondary}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    paddingLeft: 52,
  },
  primaryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
  },
});
