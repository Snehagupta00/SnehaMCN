import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import PhoneActivityService from '../../services/PhoneActivityService';
import Card from '../../components/ui/Card';
import { Typography } from '../../constants/typography';

/**
 * Phone Activity Screen
 * Shows app usage statistics and phone activity data
 */
export default function PhoneActivityScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [usageStats, setUsageStats] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, info] = await Promise.all([
        PhoneActivityService.getUsageStats(),
        PhoneActivityService.getDeviceInfo(),
      ]);
      setUsageStats(stats);
      setDeviceInfo(info);
    } catch (error) {
      Alert.alert('Error', 'Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };


  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading && !usageStats) {
    return (
      <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Phone Activity</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading activity data...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#E3F2FD', '#FFFFFF']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#424242" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phone Activity</Text>
        <TouchableOpacity onPress={loadData}>
          <Ionicons name="refresh" size={24} color="#424242" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {usageStats && (
          <>
            {/* Today's Usage */}
            <Card style={styles.statsCard}>
              <Text style={styles.cardTitle}>TODAY'S USAGE</Text>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatTime(usageStats.today.seconds)}</Text>
                  <Text style={styles.statLabel}>Total Time</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{usageStats.today.sessions}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatTime(usageStats.currentSession.seconds)}</Text>
                  <Text style={styles.statLabel}>Current</Text>
                </View>
              </View>
            </Card>

            {/* Weekly Summary */}
            <Card style={styles.statsCard}>
              <Text style={styles.cardTitle}>WEEKLY SUMMARY</Text>
              <View style={styles.weekStats}>
                <View style={styles.weekStatItem}>
                  <Text style={styles.weekStatValue}>{formatTime(usageStats.week.totalSeconds)}</Text>
                  <Text style={styles.weekStatLabel}>Total This Week</Text>
                </View>
                <View style={styles.weekStatItem}>
                  <Text style={styles.weekStatValue}>{formatTime(usageStats.week.avgDailySeconds || 0)}</Text>
                  <Text style={styles.weekStatLabel}>Daily Average</Text>
                </View>
              </View>
            </Card>

            {/* Device Information */}
            {deviceInfo && (
              <Card style={styles.deviceCard}>
                <Text style={styles.cardTitle}>DEVICE INFORMATION</Text>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceLabel}>Device:</Text>
                    <Text style={styles.deviceValue}>{deviceInfo.deviceName}</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceLabel}>Brand:</Text>
                    <Text style={styles.deviceValue}>{deviceInfo.brand}</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceLabel}>Model:</Text>
                    <Text style={styles.deviceValue}>{deviceInfo.modelName}</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceLabel}>OS:</Text>
                    <Text style={styles.deviceValue}>{deviceInfo.platform} {deviceInfo.osVersion}</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceLabel}>App Version:</Text>
                    <Text style={styles.deviceValue}>{deviceInfo.appVersion} ({deviceInfo.appBuild})</Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Info Note */}
            <Card style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle-outline" size={20} color="#1E88E5" />
                <Text style={styles.infoTitle}>How It Works</Text>
              </View>
              <Text style={styles.infoText}>
                • Tracks app usage time automatically{'\n'}
                • Records sessions when app is active{'\n'}
                • Data is stored locally on your device{'\n'}
                • No personal data is shared externally
              </Text>
            </Card>

          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#1E88E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    ...Typography.body,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    ...Typography.subheading,
    fontSize: 14,
    marginBottom: 16,
    color: '#666666',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...Typography.headline,
    fontSize: 24,
    color: '#1E88E5',
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.small,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  weekStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  weekStatValue: {
    ...Typography.headline,
    fontSize: 28,
    color: '#1E88E5',
    marginBottom: 8,
  },
  weekStatLabel: {
    ...Typography.body,
    fontSize: 14,
    color: '#666666',
  },
  deviceCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  deviceInfo: {
    marginTop: 8,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  deviceLabel: {
    ...Typography.body,
    color: '#666666',
    fontWeight: '600',
  },
  deviceValue: {
    ...Typography.body,
    color: '#1a1a1a',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    ...Typography.subheading,
    marginLeft: 8,
    color: '#1E88E5',
  },
  infoText: {
    ...Typography.body,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
