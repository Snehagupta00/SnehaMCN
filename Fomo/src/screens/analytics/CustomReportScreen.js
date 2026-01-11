import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * Custom Report Screen
 * Generate custom reports and export data
 */
export default function CustomReportScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const periods = [
    { id: 'week', label: 'Last Week' },
    { id: 'month', label: 'Last Month' },
    { id: 'quarter', label: 'Last 3 Months' },
    { id: 'year', label: 'Last Year' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const formats = [
    { id: 'pdf', label: 'PDF', icon: '📄' },
    { id: 'csv', label: 'CSV', icon: '📊' },
    { id: 'excel', label: 'Excel', icon: '📈' },
  ];

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    alert(`Generating ${selectedFormat.toUpperCase()} report for ${periods.find(p => p.id === selectedPeriod)?.label}...`);
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Custom Report</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.introCard}>
          <Text style={styles.introTitle}>Generate Custom Report</Text>
          <Text style={styles.introText}>
            Create a detailed report of your activity, missions, and achievements.
          </Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SELECT PERIOD:</Text>
          <View style={styles.optionsGrid}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.optionButton,
                  selectedPeriod === period.id && styles.optionButtonSelected
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text style={[
                  styles.optionText,
                  selectedPeriod === period.id && styles.optionTextSelected
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>EXPORT FORMAT:</Text>
          <View style={styles.formatGrid}>
            {formats.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatButton,
                  selectedFormat === format.id && styles.formatButtonSelected
                ]}
                onPress={() => setSelectedFormat(format.id)}
              >
                <Text style={styles.formatIcon}>{format.icon}</Text>
                <Text style={[
                  styles.formatText,
                  selectedFormat === format.id && styles.formatTextSelected
                ]}>
                  {format.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.includeCard}>
          <Text style={styles.sectionTitle}>INCLUDE IN REPORT:</Text>
          <View style={styles.checkboxItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.checkboxText}>Mission completion history</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.checkboxText}>Streak statistics</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.checkboxText}>Reward earnings</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.checkboxText}>Achievement badges</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.checkboxText}>Weekly summaries</Text>
          </View>
        </Card>

        <Button
          title="Generate Report"
          onPress={handleGenerateReport}
          variant="primary"
          style={styles.generateButton}
        />

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Report Features</Text>
          <Text style={styles.infoText}>
            • Detailed activity breakdown{'\n'}
            • Visual charts and graphs{'\n'}
            • Exportable in multiple formats{'\n'}
            • Shareable via email
          </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  introCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E88E5',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  optionTextSelected: {
    color: '#1E88E5',
    fontWeight: '600',
  },
  formatGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatButton: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formatButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E88E5',
  },
  formatIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  formatText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  formatTextSelected: {
    color: '#1E88E5',
    fontWeight: '600',
  },
  includeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
  },
  generateButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoCard: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#FFF9E6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
});
