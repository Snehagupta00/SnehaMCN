import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * Privacy & Security Screen
 * Privacy settings and security options
 */
export default function PrivacyScreen({ navigation }) {
  const [settings, setSettings] = useState({
    dataSharing: false,
    analyticsTracking: false,
    personalizedAds: false,
    twoFactorAuth: true,
    biometricAuth: false,
    activityVisibility: 'public',
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingItem = ({ icon, title, description, value, onToggle, showSwitch = true }) => (
    <Card style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <Text style={styles.settingIcon}>{icon}</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            {description && <Text style={styles.settingDescription}>{description}</Text>}
          </View>
        </View>
        {showSwitch && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#BDBDBD', true: '#1E88E5' }}
            thumbColor={value ? '#FFFFFF' : '#F5F5F5'}
          />
        )}
      </View>
    </Card>
  );

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DATA PRIVACY:</Text>
          
          <SettingItem
            icon="📊"
            title="Data Sharing"
            description="Allow sharing of anonymized data for improvements"
            value={settings.dataSharing}
            onToggle={() => toggleSetting('dataSharing')}
          />

          <SettingItem
            icon="📈"
            title="Analytics Tracking"
            description="Help us improve by sharing usage analytics"
            value={settings.analyticsTracking}
            onToggle={() => toggleSetting('analyticsTracking')}
          />

          <SettingItem
            icon="🎯"
            title="Personalized Ads"
            description="Show personalized advertisements"
            value={settings.personalizedAds}
            onToggle={() => toggleSetting('personalizedAds')}
          />
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SECURITY:</Text>
          
          <SettingItem
            icon="🔐"
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            value={settings.twoFactorAuth}
            onToggle={() => toggleSetting('twoFactorAuth')}
          />

          <SettingItem
            icon="👆"
            title="Biometric Authentication"
            description="Use fingerprint or face ID to login"
            value={settings.biometricAuth}
            onToggle={() => toggleSetting('biometricAuth')}
          />

          <TouchableOpacity style={styles.actionButton}>
            <Card style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text style={styles.settingIcon}>🔑</Text>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Change Password</Text>
                  <Text style={styles.settingDescription}>Update your account password</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
              </View>
            </Card>
          </TouchableOpacity>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ACTIVITY VISIBILITY:</Text>
          
          <TouchableOpacity style={styles.visibilityOption}>
            <Text style={styles.visibilityText}>Public</Text>
            {settings.activityVisibility === 'public' && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.visibilityOption}>
            <Text style={styles.visibilityText}>Friends Only</Text>
            {settings.activityVisibility === 'friends' && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.visibilityOption}>
            <Text style={styles.visibilityText}>Private</Text>
            {settings.activityVisibility === 'private' && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
          </TouchableOpacity>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Privacy Matters</Text>
          <Text style={styles.infoText}>
            We take your privacy seriously. Your personal data is encrypted and stored securely. 
            We never sell your information to third parties.
          </Text>
          <Button
            title="View Privacy Policy"
            variant="outline"
            style={styles.policyButton}
            onPress={() => {}}
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
  actionButton: {
    marginTop: 8,
  },
  actionCard: {
    padding: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  visibilityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  infoCard: {
    marginTop: 8,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 16,
  },
  policyButton: {
    alignSelf: 'flex-start',
  },
});
