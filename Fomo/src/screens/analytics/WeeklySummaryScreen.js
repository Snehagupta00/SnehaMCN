import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

const WeeklySummaryScreen = ({ navigation }) => {
  // Mock data for demonstration - replacing with selector in real app
  const weeklyData = [
    { day: 'Mon', completed: 4, total: 5 },
    { day: 'Tue', completed: 5, total: 5 },
    { day: 'Wed', completed: 3, total: 5 },
    { day: 'Thu', completed: 5, total: 5 },
    { day: 'Fri', completed: 2, total: 5 },
    { day: 'Sat', completed: 4, total: 5 },
    { day: 'Sun', completed: 1, total: 5 },
  ];

  const missionTypes = [
    { type: 'Steps', count: 12, color: Colors.SHARP_BLUE, icon: 'walk' },
    { type: 'Phone-Free', count: 8, color: Colors.GOLD, icon: 'phone-portrait' },
    { type: 'Expense', count: 5, color: Colors.SUCCESS_GREEN, icon: 'wallet' },
    { type: 'Quiz', count: 4, color: Colors.AMBER, icon: 'school' },
    { type: 'Productivity', count: 6, color: Colors.WARNING_RED, icon: 'timer' },
  ];

  // Calculate totals
  const totalCompleted = weeklyData.reduce((acc, day) => acc + day.completed, 0);
  const totalPossible = weeklyData.reduce((acc, day) => acc + day.total, 0);
  const completionRate = Math.round((totalCompleted / totalPossible) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Summary</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Ionicons name="calendar" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Weekly Performance Overview */}
        <Card style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>WEEKLY PERFORMANCE</Text>
          <View style={styles.chartContainer}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barBackground}>
                  <LinearGradient
                    colors={[Colors.GROW_START, Colors.GROW_END]}
                    style={[
                      styles.barFill, 
                      { height: `${(day.completed / day.total) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              <Text style={{fontWeight: '700', color: Colors.SUCCESS_GREEN}}>{totalCompleted} </Text>
              Missions Completed
            </Text>
            <Text style={styles.summaryText}>
              <Text style={{fontWeight: '700', color: Colors.GOLD}}>{completionRate}% </Text>
              Completion Rate
            </Text>
          </View>
        </Card>

        {/* Daily Breakdown */}
        <Card style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>DAILY BREAKDOWN</Text>
          {weeklyData.map((day, index) => (
            <View key={index} style={styles.dailyRow}>
              <View style={styles.dayInfo}>
                <Text style={styles.rowDay}>{day.day}</Text>
                <Text style={styles.rowDate}>Oct {23 + index}</Text>
              </View>
              <View style={styles.missionCountContainer}>
                {Array.from({ length: day.total }).map((_, i) => (
                  <Ionicons 
                    key={i} 
                    name={i < day.completed ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={i < day.completed ? Colors.SUCCESS_GREEN : Colors.MEDIUM_GRAY}
                    style={{ marginLeft: 4 }}
                  />
                ))}
              </View>
              <Text style={styles.percentageText}>
                {Math.round((day.completed / day.total) * 100)}%
              </Text>
            </View>
          ))}
        </Card>

        {/* Mission Type Breakdown */}
        <Card style={styles.typeCard}>
          <Text style={styles.sectionTitle}>MISSION TYPE BREAKDOWN</Text>
          {missionTypes.map((item, index) => (
            <View key={index} style={styles.typeRow}>
              <View style={styles.typeIconContainer}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.typeInfo}>
                <View style={styles.typeHeader}>
                  <Text style={styles.typeName}>{item.type}</Text>
                  <Text style={styles.typeCount}>{item.count} missions</Text>
                </View>
                <View style={styles.typeBarBg}>
                  <View 
                    style={[
                      styles.typeBarFill, 
                      { width: `${(item.count / 15) * 100}%`, backgroundColor: item.color }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Insights Section */}
        <Card style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>INSIGHTS & RECOMMENDATIONS</Text>
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={24} color={Colors.SHARP_BLUE} />
            <Text style={styles.insightText}>
              <Text style={{fontWeight: '700'}}>Great job on Steps!</Text> You've hit your goal 6 out of 7 days this week.
            </Text>
          </View>
          <View style={styles.insightDivider} />
          <View style={styles.insightItem}>
            <Ionicons name="bulb" size={24} color={Colors.GOLD} />
            <Text style={styles.insightText}>
              <Text style={{fontWeight: '700'}}>Tip:</Text> Try the "Phone-Free" mission in the mornings to boost your focus score.
            </Text>
          </View>
        </Card>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_LIGHT,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.SHARP_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  calendarButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingVertical: Spacing.md,
    paddingBottom: 100,
  },
  overviewCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 190,
    marginBottom: Spacing.lg,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    width: 12,
    height: '100%',
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.BACKGROUND_LIGHT,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.TEXT_BODY,
  },
  breakdownCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    justifyContent: 'space-between',
  },
  dayInfo: {
    width: 60,
  },
  rowDay: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  rowDate: {
    fontSize: 12,
    color: Colors.TEXT_SMALL,
  },
  missionCountContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    width: 40,
    textAlign: 'right',
  },
  typeCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  typeInfo: {
    flex: 1,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  typeCount: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '600',
  },
  typeBarBg: {
    height: 6,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    borderRadius: 3,
    overflow: 'hidden',
  },
  typeBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightsCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  insightText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 14,
    color: Colors.TEXT_BODY,
    lineHeight: 20,
  },
  insightDivider: {
    height: 1,
    backgroundColor: Colors.BACKGROUND_LIGHT,
    marginVertical: Spacing.sm,
  },
});

export default WeeklySummaryScreen;
