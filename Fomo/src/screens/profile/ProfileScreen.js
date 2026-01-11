import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert, 
  Keyboard, 
  Pressable 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUsername } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function ProfileScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const { max: streakRecord } = useSelector((state) => state.streaks);
  const { wallet } = useSelector((state) => state.rewards);
  const { daily: missions } = useSelector((state) => state.missions);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username.trim())) {
      Alert.alert('Error', 'Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens');
      return;
    }

    try {
      const result = await dispatch(updateUsername(username.trim()));
      if (updateUsername.fulfilled.match(result)) {
        setShowUsernameModal(false);
        Alert.alert('Success', 'Username updated successfully!');
      } else {
        Alert.alert('Error', result.payload || 'Failed to update username');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update username');
    }
  };

  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const needsUsername = !user?.username;
  const completedMissions = (missions || []).filter((m) => m.has_attempted).length;
  const totalCoinsEarned = wallet?.total_balance || wallet?.balance || 0;
  const coinsRedeemed = 1000;

  return (
    <View style={styles.container}>
      {/* Header remains exactly the same */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.username || user?.email)?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{displayName}</Text>
            
            <TouchableOpacity 
              style={styles.editUsernameBtn}
              onPress={() => {
                setUsername(user?.username || user?.email?.split('@')[0] || '');
                setShowUsernameModal(true);
              }}
            >
              <Text style={styles.editUsernameText}>
                {needsUsername ? 'Set username' : user?.username}
              </Text>
              <Ionicons name="pencil" size={16} color="#2196F3" />
            </TouchableOpacity>

            <Text style={styles.emailText}>{user?.email || 'No email'}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Joined Dec 2025</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaItem}>Level 7</Text>
          </View>
        </Card>

        {/* Stats Grid */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedMissions}</Text>
              <Text style={styles.statLabel}>Missions</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streakRecord}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCoinsEarned.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{coinsRedeemed.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Redeemed</Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => navigation.navigate('NotificationPreferences')}
          >
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>Location & Timezone</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => navigation.navigate('Privacy')}
          >
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => navigation.navigate('HelpFAQ')}
          >
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button 
            title="Log Out" 
            onPress={handleLogout} 
            variant="outline" 
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>

      {/* Username Modal - Modernized */}
      <Modal
        visible={showUsernameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUsernameModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={Keyboard.dismiss}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {needsUsername ? 'Choose Username' : 'Change Username'}
              </Text>
              <TouchableOpacity onPress={() => setShowUsernameModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              3–20 characters • letters, numbers, underscores, hyphens
            </Text>

            <TextInput
              style={styles.usernameInput}
              placeholder="your_username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              editable={!loading}
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowUsernameModal(false)}
                style={styles.modalBtn}
                disabled={loading}
              />
              <Button
                title={loading ? "Saving..." : "Save"}
                variant="primary"
                onPress={handleUpdateUsername}
                style={styles.modalBtn}
                disabled={loading}
                loading={loading}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 70,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E88E5',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  profileCard: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  editUsernameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    gap: 6,
  },
  editUsernameText: {
    fontSize: 15,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  metaItem: {
    fontSize: 13,
    color: '#94A3B8',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },

  statsCard: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  settingsCard: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },

  logoutContainer: {
    marginTop: 24,
    marginBottom: 32,
    marginHorizontal: 16,
  },
  logoutButton: {
    borderColor: '#EF4444',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 18,
  },
  usernameInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
  },
});