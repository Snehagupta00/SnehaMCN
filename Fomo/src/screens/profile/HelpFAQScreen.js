import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';

/**
 * Help & FAQ Screen
 * Frequently asked questions and help content
 */
export default function HelpFAQScreen({ navigation }) {
  const [expandedItems, setExpandedItems] = useState({});

  const faqs = [
    {
      id: 1,
      question: 'How do I complete a mission?',
      answer: 'Tap on a mission card to view details, then follow the instructions. You may need to provide proof (photo, screenshot, etc.) to complete the mission.',
    },
    {
      id: 2,
      question: 'What happens if I miss a day?',
      answer: 'If you don\'t complete any missions for a day, your streak will reset to 0. However, you can start a new streak the next day!',
    },
    {
      id: 3,
      question: 'How do I redeem my coins?',
      answer: 'Go to the Wallet tab, browse available vouchers and rewards, then tap "REDEEM" on any item you want. Make sure you have enough coins!',
    },
    {
      id: 4,
      question: 'How are streaks calculated?',
      answer: 'Your streak increases by 1 for each consecutive day you complete at least one mission. Missing a day resets your streak to 0.',
    },
    {
      id: 5,
      question: 'What are multipliers?',
      answer: 'Multipliers increase your reward earnings based on your streak length. 7+ days = 1.5x, 14+ days = 2.0x, 30+ days = 2.5x multiplier!',
    },
    {
      id: 6,
      question: 'How do I change my password?',
      answer: 'Go to Profile > Settings > Privacy & Security, then tap "Change Password" to update your password.',
    },
    {
      id: 7,
      question: 'Can I transfer coins to another user?',
      answer: 'Currently, coins cannot be transferred between users. You can only redeem them for vouchers and rewards.',
    },
    {
      id: 8,
      question: 'What if my mission verification fails?',
      answer: 'If verification fails, you can try again. Make sure your proof (photo/screenshot) clearly shows the completed task. Contact support if issues persist.',
    },
  ];

  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <LinearGradient colors={['#1E88E5', '#00BCD4']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.introCard}>
          <Text style={styles.introTitle}>Need Help?</Text>
          <Text style={styles.introText}>
            Find answers to common questions below. If you can't find what you're looking for, contact our support team.
          </Text>
        </Card>

        {faqs.map((faq) => (
          <Card key={faq.id} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleItem(faq.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expandedItems[faq.id] ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#1E88E5"
              />
            </TouchableOpacity>
            {expandedItems[faq.id] && (
              <View style={styles.faqAnswerContainer}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            )}
          </Card>
        ))}

        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Still Need Help?</Text>
          <Text style={styles.contactText}>Contact our support team:</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="mail-outline" size={20} color="#1E88E5" />
            <Text style={styles.contactButtonText}>support@micromissions.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call-outline" size={20} color="#1E88E5" />
            <Text style={styles.contactButtonText}>+1 (555) 123-4567</Text>
          </TouchableOpacity>
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
  introCard: {
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
    color: '#424242',
    lineHeight: 20,
  },
  faqCard: {
    marginBottom: 12,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  faqAnswerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  contactCard: {
    marginTop: 8,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#1E88E5',
    marginLeft: 12,
    fontWeight: '500',
  },
});
