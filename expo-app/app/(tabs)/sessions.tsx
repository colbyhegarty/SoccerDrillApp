import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays } from 'lucide-react-native';
import { colors, spacing } from '../../src/theme/colors';

export default function SessionsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Sessions</Text>
      </View>
      
      <View style={styles.centered}>
        <View style={styles.iconContainer}>
          <CalendarDays size={32} color={colors.mutedForeground} />
        </View>
        <Text style={styles.placeholderTitle}>Coming Soon</Text>
        <Text style={styles.placeholderText}>
          Plan and organize your training sessions
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  placeholderTitle: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  placeholderText: {
    color: colors.mutedForeground,
    fontSize: 14,
    textAlign: 'center',
  },
});
