import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Animated as RNAnimated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import AppIcon from '../../components/ui/AppIcon';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDailyMissions, updateMissionTimeRemaining } from '../../store/slices/missionSlice';
import { fetchWallet } from '../../store/slices/rewardSlice';
import { fetchStreak } from '../../store/slices/streakSlice';
import { setSelectedMission } from '../../store/slices/uiSlice';
import StreakCard from '../../components/home/StreakCard';
import WalletWidget from '../../components/home/WalletWidget';
import MissionCard from '../../components/home/MissionCard';
import { Typography } from '../../constants/typography';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { daily: missions = [], completedToday, loading, error } = useSelector((state) => state.missions);
  const { wallet = { balance: 0, total_balance: 0 } } = useSelector((state) => state.rewards);
  const { current: streak = 0, multiplier = 1.0 } = useSelector((state) => state.streaks);
  const { user } = useSelector((state) => state.auth);

  const intervalRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new RNAnimated.Value(300)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    loadData();
  }, []);

  // Pulse animation for urgency banner
  useEffect(() => {
    const hoursLeft = getMinHoursLeft();
    if (hoursLeft <= 3 && hoursLeft > 0) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          RNAnimated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [missions]);

  useEffect(() => {
    // Only start interval when missions are loaded
    if (missions && missions.length > 0) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set up interval for countdown updates
      intervalRef.current = setInterval(() => {
        updateCountdowns();
      }, 1000); // Update every second
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [missions?.length, updateCountdowns]);

  const loadData = async () => {
    try {
      const results = await Promise.allSettled([
        dispatch(fetchDailyMissions()),
        dispatch(fetchWallet()),
        dispatch(fetchStreak()),
      ]);
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const names = ['missions', 'wallet', 'streak'];
          console.error(`Failed to load ${names[index]}:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const missionsRef = useRef(missions);

  // Keep ref in sync with missions
  useEffect(() => {
    missionsRef.current = missions;
  }, [missions]);

  const updateCountdowns = useCallback(() => {
    const currentMissions = missionsRef.current;
    if (!currentMissions || currentMissions.length === 0) return;

    const updates = [];
    currentMissions.forEach((mission) => {
      if (mission && !mission.is_expired && mission.expires_at) {
        const now = new Date();
        const expiresAt = new Date(mission.expires_at);
        const timeRemaining = Math.max(0, expiresAt - now);

        // Only update if time has actually changed
        const currentHours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const storedHours = mission.time_remaining_hours || 0;

        if (currentHours !== storedHours || timeRemaining === 0) {
          updates.push({
            missionId: mission.mission_id,
            timeRemaining,
          });
        }
      }
    });

    // Batch all updates in a single dispatch cycle
    updates.forEach((update) => {
      dispatch(updateMissionTimeRemaining(update));
    });
  }, [dispatch]);

  const handleMissionPress = (mission) => {
    dispatch(setSelectedMission(mission.mission_id));
    navigation.navigate('MissionDetail', { missionId: mission.mission_id });
  };

  const handleCompletePress = (mission) => {
    navigation.navigate('MissionCompletion', { missionId: mission.mission_id });
  };

  const openMenu = () => {
    setMenuVisible(true);
    RNAnimated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  };

  const closeMenu = () => {
    RNAnimated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  const handleMenuAction = (action) => {
    closeMenu();
    setTimeout(() => {
      const rootNavigator = navigation.getParent()?.getParent();

      if (!rootNavigator) {
        return;
      }

      try {
        if (action === 'profile') {
          rootNavigator.dispatch(
            CommonActions.navigate({
              name: 'Main',
              params: {
                screen: 'Profile',
              },
            })
          );
        } else if (action === 'settings') {
          rootNavigator.dispatch(
            CommonActions.navigate({
              name: 'Main',
              params: {
                screen: 'Profile',
                params: {
                  screen: 'Settings',
                },
              },
            })
          );
        } else if (action === 'help') {
          rootNavigator.dispatch(
            CommonActions.navigate({
              name: 'Main',
              params: {
                screen: 'Profile',
                params: {
                  screen: 'HelpFAQ',
                },
              },
            })
          );
        } else if (action === 'analytics') {
          rootNavigator.dispatch(
            CommonActions.navigate({
              name: 'Main',
              params: {
                screen: 'Analytics',
              },
            })
          );
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 300);
  };

  const getMinHoursLeft = () => {
    if (!missions || missions.length === 0) return 24;
    const availableMissions = missions.filter((m) => !m.is_expired && !m.has_attempted && !m.is_locked);
    if (availableMissions.length === 0) return 24;
    return Math.min(...availableMissions.map((m) => m.time_remaining_hours || 24));
  };

  const getMissionStatus = (mission) => {
    if (!mission) return 'not_started';
    if (mission.has_attempted) return 'completed';
    if (mission.is_expired) return 'expired';
    if (mission.is_active) return 'in_progress';
    if (mission.is_locked) return 'locked';
    return 'not_started';
  };

  const completedMissions = (missions || []).filter((m) => m.has_attempted || getMissionStatus(m) === 'completed');
  const activeMissions = (missions || []).filter((m) => getMissionStatus(m) === 'in_progress');
  const notStartedMissions = (missions || []).filter((m) => getMissionStatus(m) === 'not_started');
  const lockedMissions = (missions || []).filter((m) => getMissionStatus(m) === 'locked');
  const availableMissions = (missions || []).filter((m) => !m.is_expired && !m.has_attempted && !m.is_locked);

  const hoursLeft = Math.floor(getMinHoursLeft());
  const completionPercent = missions.length > 0 ? (completedMissions.length / missions.length) * 100 : 0;

  return (
    <LinearGradient
      colors={['#F0F7FF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Premium Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back! 👋</Text>
          <Text style={styles.headerTitle}>FOMO</Text>
        </View>
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <LinearGradient
            colors={[Colors.SHARP_BLUE, '#00BCD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.menuButtonGradient}
          >
            <AppIcon name="menu" size={20} color={Colors.BACKGROUND} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Enhanced Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <RNAnimated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Menu Header */}
            <LinearGradient
              colors={[Colors.SHARP_BLUE, '#00BCD4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuHeaderGradient}
            >
              <View style={styles.menuHeader}>
                <View style={styles.menuUserInfo}>
                  <View style={styles.menuAvatar}>
                    <Text style={styles.menuAvatarText}>
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={styles.menuUserDetails}>
                    <Text style={styles.menuUserName}>
                      {user?.email?.split('@')[0] || 'User'}
                    </Text>
                    <Text style={styles.menuUserEmail}>{user?.email || ''}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={closeMenu} style={styles.menuCloseButton}>
                  <AppIcon name="close" size={24} color={Colors.BACKGROUND} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Menu Items */}
            <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
              {/* Main Actions */}
              <Text style={styles.menuSectionTitle}>ACCOUNT</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuAction('profile')}
              >
                <View style={styles.menuItemIcon}>
                  <AppIcon name="person-outline" size={22} color={Colors.SHARP_BLUE} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Profile</Text>
                  <Text style={styles.menuItemSubtext}>View your stats</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuAction('settings')}
              >
                <View style={styles.menuItemIcon}>
                  <AppIcon name="settings-outline" size={22} color={Colors.SHARP_BLUE} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Settings</Text>
                  <Text style={styles.menuItemSubtext}>Customize app</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              {/* Rewards Section */}
              <Text style={styles.menuSectionTitle}>REWARDS</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => {
                    const rootNavigator = navigation.getParent()?.getParent();
                    if (rootNavigator) {
                      rootNavigator.dispatch(
                        CommonActions.navigate({
                          name: 'Main',
                          params: {
                            screen: 'Wallet',
                          },
                        })
                      );
                    }
                  }, 300);
                }}
              >
                <View style={styles.menuItemIcon}>
                  <AppIcon name="wallet-outline" size={22} color={Colors.SHARP_BLUE} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Wallet</Text>
                  <Text style={styles.menuItemSubtext}>Manage coins & vouchers</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => {
                    const rootNavigator = navigation.getParent()?.getParent();
                    if (rootNavigator) {
                      rootNavigator.dispatch(
                        CommonActions.navigate({
                          name: 'Main',
                          params: {
                            screen: 'Streak',
                          },
                        })
                      );
                    }
                  }, 300);
                }}
              >
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemEmoji}>🔥</Text>
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Streaks & Badges</Text>
                  <Text style={styles.menuItemSubtext}>Track your progress</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuAction('analytics')}
              >
                <View style={styles.menuItemIcon}>
                  <AppIcon name="stats-chart-outline" size={22} color={Colors.SHARP_BLUE} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Analytics</Text>
                  <Text style={styles.menuItemSubtext}>View insights</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              {/* Support Section */}
              <Text style={styles.menuSectionTitle}>SUPPORT</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuAction('help')}
              >
                <View style={styles.menuItemIcon}>
                  <AppIcon name="help-circle-outline" size={22} color={Colors.SHARP_BLUE} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Help & FAQ</Text>
                  <Text style={styles.menuItemSubtext}>Get support</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemIcon}>
                  <AppIcon name="share-outline" size={22} color={Colors.SHARP_BLUE} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Share App</Text>
                  <Text style={styles.menuItemSubtext}>Invite friends</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemIcon}>
                  <AppIcon name="star-outline" size={22} color={Colors.SHARP_BLUE} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Rate App</Text>
                  <Text style={styles.menuItemSubtext}>Leave a review</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={Colors.MEDIUM_GRAY} />
              </TouchableOpacity>

              <View style={styles.menuFooter}>
                <Text style={styles.menuVersion}>App Version 1.0.0</Text>
              </View>
            </ScrollView>
          </RNAnimated.View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Streak Card */}
          <StreakCard
            streak={streak || 0}
            multiplier={multiplier || 1.0}
            completedMissions={completedMissions.length}
            totalMissions={missions.length || 0}
          />

          {/* Wallet Widget */}
          <WalletWidget
            balance={wallet?.total_balance ?? wallet?.balance ?? 0}
            todayEarnings={150}
            weekEarnings={500}
            onRedeemPress={() => navigation.navigate('Wallet')}
          />

          {/* FOMO Urgency Banner - Enhanced */}
          {hoursLeft <= 3 && hoursLeft > 0 && availableMissions.length > 0 && (
            <RNAnimated.View
              style={[
                styles.urgencyBannerWrapper,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <LinearGradient
                colors={
                  hoursLeft <= 1
                    ? ['#FF1744', '#FF5252']
                    : hoursLeft <= 2
                    ? ['#FF6B6B', '#FF9100']
                    : ['#FF9100', '#FFA726']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.urgencyBanner}
              >
                <View style={styles.urgencyContent}>
                  <View>
                    <Text style={styles.urgencyTitle}>
                      {hoursLeft <= 1 ? '🚨 LAST CHANCE!' : '⏰ HURRY UP!'}
                    </Text>
                    <Text style={styles.urgencySubtitle}>
                      Only {hoursLeft} {hoursLeft === 1 ? 'hour' : 'hours'} left to complete today's missions
                    </Text>
                  </View>
                  <View style={styles.urgencyBadge}>
                    <Text style={styles.urgencyBadgeText}>
                      {availableMissions.length}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </RNAnimated.View>
          )}

          {/* Missions Section */}
          <View style={styles.missionsSection}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>TODAY'S MISSIONS</Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${completionPercent}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {completedMissions.length}/{missions.length}
                  </Text>
                </View>
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <AppIcon name="alert-circle-outline" size={20} color={Colors.WARNING_RED} />
                <Text style={styles.errorText}>Error loading missions</Text>
                <TouchableOpacity onPress={loadData} style={styles.retrySmallButton}>
                  <Text style={styles.retrySmallText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Completed Missions */}
            {completedMissions.length > 0 && (
              <View style={styles.missionGroup}>
                {completedMissions.map((mission) => (
                  <MissionCard
                    key={mission.mission_id}
                    mission={{ ...mission, status: 'completed' }}
                    onPress={() => handleMissionPress(mission)}
                    onCompletePress={() => handleCompletePress(mission)}
                  />
                ))}
              </View>
            )}

            {/* Active Missions */}
            {activeMissions.length > 0 && (
              <View style={styles.missionGroup}>
                {activeMissions.map((mission) => (
                  <MissionCard
                    key={mission.mission_id}
                    mission={{ ...mission, status: 'in_progress' }}
                    onPress={() => handleMissionPress(mission)}
                    onCompletePress={() => handleCompletePress(mission)}
                  />
                ))}
              </View>
            )}

            {/* Not Started Missions */}
            {notStartedMissions.length > 0 && (
              <View style={styles.missionGroup}>
                {notStartedMissions.map((mission) => (
                  <MissionCard
                    key={mission.mission_id}
                    mission={{ ...mission, status: 'not_started' }}
                    onPress={() => handleMissionPress(mission)}
                    onCompletePress={() => handleCompletePress(mission)}
                  />
                ))}
              </View>
            )}

            {/* Locked Missions */}
            {lockedMissions.length > 0 && (
              <View style={styles.missionGroup}>
                {lockedMissions.map((mission) => (
                  <MissionCard
                    key={mission.mission_id}
                    mission={{ ...mission, status: 'locked' }}
                    onPress={() => handleMissionPress(mission)}
                    onCompletePress={() => handleCompletePress(mission)}
                  />
                ))}
              </View>
            )}

            {/* Empty State */}
            {!loading && (!missions || missions.length === 0) && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyText}>
                  {error ? 'Failed to load missions' : 'No missions available today'}
                </Text>
                <Text style={styles.emptySubtext}>
                  Check back tomorrow for fresh missions!
                </Text>
                {error && (
                  <TouchableOpacity
                    style={styles.emptyRetryButton}
                    onPress={loadData}
                  >
                    <Text style={styles.emptyRetryText}>Try Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Loading State */}
            {loading && missions.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.loadingEmoji}>⏳</Text>
                <Text style={styles.emptyText}>Loading your missions...</Text>
              </View>
            )}

            {/* Tomorrow Preview */}
            {missions && missions.length > 0 && (
              <View style={styles.tomorrowPreview}>
                <AppIcon name="arrow-down" size={16} color={Colors.TEXT_SECONDARY} />
                <Text style={styles.tomorrowText}>Tomorrow's preview</Text>
              </View>
            )}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    backgroundColor: 'transparent',
  },
  headerGreeting: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    fontFamily: 'Poppins-Bold',
  },
  menuButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  menuButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: 320,
    height: '100%',
    backgroundColor: Colors.BACKGROUND,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  menuHeaderGradient: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderBottomLeftRadius: 0,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: Spacing.sm,
  },
  menuUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  menuAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.BACKGROUND,
  },
  menuUserDetails: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  menuUserEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Roboto-Regular',
  },
  menuCloseButton: {
    padding: Spacing.sm,
  },
  menuItems: {
    flex: 1,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginHorizontal: 0,
    borderRadius: 14,
    marginBottom: Spacing.xs,
    backgroundColor: '#F8FAFC',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuItemEmoji: {
    fontSize: 20,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 3,
  },
  menuItemSubtext: {
    fontSize: 11,
    color: Colors.TEXT_SECONDARY,
    fontFamily: 'Roboto-Regular',
    lineHeight: 14,
  },
  menuFooter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    marginTop: Spacing.md,
  },
  menuVersion: {
    fontSize: 11,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  missionsSection: {
    marginTop: Spacing.lg,
  },
  sectionHeaderRow: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.SHARP_BLUE,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.TEXT_SECONDARY,
    minWidth: 40,
  },
  urgencyBannerWrapper: {
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  urgencyBanner: {
    padding: Spacing.lg,
  },
  urgencyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.BACKGROUND,
    marginBottom: Spacing.xs,
  },
  urgencySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Roboto-Regular',
    maxWidth: 200,
  },
  urgencyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgencyBadgeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.BACKGROUND,
  },
  missionGroup: {
    marginBottom: Spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.WARNING_RED,
  },
  errorText: {
    flex: 1,
    marginLeft: Spacing.md,
    color: Colors.WARNING_RED,
    fontSize: 14,
    fontWeight: '600',
  },
  retrySmallButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.WARNING_RED,
    borderRadius: 6,
  },
  retrySmallText: {
    color: Colors.BACKGROUND,
    fontSize: 12,
    fontWeight: '700',
  },
  tomorrowPreview: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginTop: Spacing.md,
  },
  tomorrowText: {
    fontSize: 13,
    color: Colors.TEXT_SECONDARY,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  loadingEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyRetryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.SHARP_BLUE,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  emptyRetryText: {
    color: Colors.BACKGROUND,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});