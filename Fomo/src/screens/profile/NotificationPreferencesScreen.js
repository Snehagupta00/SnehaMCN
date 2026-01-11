import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';

/**
 * Notification Preferences Screen
 * Manage notification settings
 */
export default function NotificationPreferencesScreen({ navigation }) {
  const [settings, setSettings] = useState({
    dailyReminders: true,
    missionReminders: true,
    streakReminders: true,
    rewardNotifications: true,
    leaderboardUpdates: false,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingItem = ({ icon, title, description, value, onToggle, disabled = false }) => (
    <Card style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <Text style={styles.settingIcon}>{icon}</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            {description && <Text style={styles.settingDescription}>{description}</Text>}
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ false: '#BDBDBD', true: '#1E88E5' }}
          thumbColor={value ? '#FFFFFF' : '#F5F5F5'}
        />
      </View>
    </Card>
  );

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>REMINDERS:</Text>
          
          <SettingItem
            icon="⏰"
            title="Daily Reminders"
            description="Get notified about new daily missions"
            value={settings.dailyReminders}
            onToggle={() => toggleSetting('dailyReminders')}
          />

          <SettingItem
            icon="🎯"
            title="Mission Reminders"
            description="Reminders for incomplete missions"
            value={settings.missionReminders}
            onToggle={() => toggleSetting('missionReminders')}
          />

          <SettingItem
            icon="🔥"
            title="Streak Reminders"
            description="Don't break your streak!"
            value={settings.streakReminders}
            onToggle={() => toggleSetting('streakReminders')}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS:</Text>
          
          <SettingItem
            icon="💰"
            title="Reward Notifications"
            description="Get notified when you earn rewards"
            value={settings.rewardNotifications}
            onToggle={() => toggleSetting('rewardNotifications')}
          />

          <SettingItem
            icon="🏆"
            title="Leaderboard Updates"
            description="Updates about your ranking"
            value={settings.leaderboardUpdates}
            onToggle={() => toggleSetting('leaderboardUpdates')}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SOUND & VIBRATION:</Text>
          
          <SettingItem
            icon="🔊"
            title="Sound"
            description="Play sound for notifications"
            value={settings.soundEnabled}
            onToggle={() => toggleSetting('soundEnabled')}
          />

          <SettingItem
            icon="📳"
            title="Vibration"
            description="Vibrate for notifications"
            value={settings.vibrationEnabled}
            onToggle={() => toggleSetting('vibrationEnabled')}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>QUIET HOURS:</Text>
          
          <SettingItem
            icon="🌙"
            title="Enable Quiet Hours"
            description={`${settings.quietStart} - ${settings.quietEnd}`}
            value={settings.quietHours}
            onToggle={() => toggleSetting('quietHours')}
          />
        </Card>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  settingItem: {
    marginBottom: 12,
    padding: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
  },
});
