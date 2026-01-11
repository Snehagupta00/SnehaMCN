import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * Settings Screen
 * App settings and preferences
 */
export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const SettingItem = ({ icon, title, description, onPress, showArrow = true }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.settingItem}>
        <View style={styles.settingContent}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>{icon}</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{title}</Text>
              {description && <Text style={styles.settingDescription}>{description}</Text>}
            </View>
          </View>
          {showArrow && (
            <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ACCOUNT:</Text>
          
          <SettingItem
            icon="👤"
            title="Edit Profile"
            description="Update your personal information"
            onPress={() => {}}
          />

          <SettingItem
            icon="🔒"
            title="Change Password"
            description="Update your account password"
            onPress={() => {}}
          />

          <SettingItem
            icon="📧"
            title="Email Settings"
            description="Manage email preferences"
            onPress={() => {}}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>PREFERENCES:</Text>
          
          <SettingItem
            icon="🔔"
            title="Notifications"
            description="Manage notification preferences"
            onPress={() => navigation.navigate('NotificationPreferences')}
          />

          <SettingItem
            icon="🌍"
            title="Language"
            description="English (US)"
            onPress={() => {}}
          />

          <SettingItem
            icon="🌙"
            title="Theme"
            description="System Default"
            onPress={() => {}}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DATA & PRIVACY:</Text>
          
          <SettingItem
            icon="🔒"
            title="Privacy & Security"
            description="Manage your privacy settings"
            onPress={() => navigation.navigate('Privacy')}
          />

          <SettingItem
            icon="📊"
            title="Data & Storage"
            description="Manage app data and cache"
            onPress={() => {}}
          />

          <SettingItem
            icon="📥"
            title="Export Data"
            description="Download your data"
            onPress={() => {}}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SUPPORT:</Text>
          
          <SettingItem
            icon="❓"
            title="Help & FAQ"
            description="Get help and answers"
            onPress={() => navigation.navigate('HelpFAQ')}
          />

          <SettingItem
            icon="📝"
            title="Terms of Service"
            description="Read our terms"
            onPress={() => {}}
          />

          <SettingItem
            icon="ℹ️"
            title="About"
            description="Version 1.0.0"
            onPress={() => {}}
          />
        </Card>

        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
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
    paddingBottom: 32,
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    marginBottom: 8,
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
  logoutSection: {
    marginTop: 8,
    marginBottom: 32,
  },
  logoutButton: {
    borderColor: '#FF5252',
  },
});
