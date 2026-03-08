import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  X,
  Bookmark,
  BookmarkCheck,
  Clock,
  Users,
  Play,
  Sparkles,
  ClipboardList,
  RefreshCw,
  Lightbulb,
  Image as ImageIcon,
  Film,
  GraduationCap,
} from 'lucide-react-native';
import { Drill, getCategoryColor, getDifficultyColor } from '../types/drill';
import { colors, borderRadius, spacing } from '../theme/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface DrillDetailModalProps {
  drill: Drill | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onSave?: (drill: Drill) => void;
  onUseAsTemplate?: (drill: Drill) => void;
}

type TabKey = 'setup' | 'instructions' | 'variations' | 'coaching';

export function DrillDetailModal({
  drill,
  isOpen,
  onClose,
  isSaved = false,
  onSave,
  onUseAsTemplate,
}: DrillDetailModalProps) {
  const [viewMode, setViewMode] = useState<'static' | 'animated'>('animated');
  const [activeTab, setActiveTab] = useState<TabKey>('setup');
  const [imageLoading, setImageLoading] = useState(true);
  
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    }
  }, [isOpen]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  };

  if (!drill) return null;

  const categoryColor = getCategoryColor(drill.category);
  const difficultyColor = getDifficultyColor(drill.difficulty);

  // Determine available tabs
  const hasSetup = !!drill.setup;
  const hasInstructions = !!drill.instructions;
  const hasVariations = !!drill.variations;
  const hasCoachingPoints = !!drill.coaching_points;
  const hasAnyContent = hasSetup || hasInstructions || hasVariations || hasCoachingPoints;

  // Format text with bullet points
  const formatText = (text?: string) => {
    if (!text) return null;
    
    const lines = text.split('\n').filter(line => line.trim());
    
    return lines.map((line, index) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.startsWith('-');
      const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s*(.+)/);
      
      const content = isBullet 
        ? trimmed.replace(/^[•*-]\s*/, '') 
        : numberedMatch 
          ? numberedMatch[2] 
          : trimmed;
      
      if (isBullet || numberedMatch) {
        return (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>▸</Text>
            <Text style={styles.bulletText}>{content}</Text>
          </View>
        );
      }
      
      return (
        <Text key={index} style={styles.paragraphText}>{trimmed}</Text>
      );
    });
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return formatText(drill.setup);
      case 'instructions':
        return formatText(drill.instructions);
      case 'variations':
        return formatText(drill.variations);
      case 'coaching':
        return formatText(drill.coaching_points);
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View style={[styles.modalContainer, modalStyle]}>
        <View style={styles.modal}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color={colors.foreground} />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>{drill.name}</Text>

            {/* Badges Row */}
            <View style={styles.badgesRow}>
              {drill.category && (
                <View style={[styles.badge, { backgroundColor: categoryColor.bg }]}>
                  <Text style={[styles.badgeText, { color: categoryColor.text }]}>
                    {drill.category.toUpperCase()}
                  </Text>
                </View>
              )}
              {drill.difficulty && (
                <View style={[styles.badge, { backgroundColor: difficultyColor.bg }]}>
                  <Text style={[styles.badgeText, { color: difficultyColor.text }]}>
                    {drill.difficulty.toUpperCase()}
                  </Text>
                </View>
              )}
              {drill.has_animation && (
                <View style={styles.badgeOutline}>
                  <Play size={12} color={colors.mutedForeground} />
                  <Text style={styles.badgeOutlineText}>Animated</Text>
                </View>
              )}
              {drill.player_count && (
                <View style={styles.badgeOutline}>
                  <Users size={12} color={colors.mutedForeground} />
                  <Text style={styles.badgeOutlineText}>
                    {drill.player_count_display || `${drill.player_count}+`} players
                  </Text>
                </View>
              )}
            </View>

            {/* Second Badge Row */}
            <View style={styles.badgesRow}>
              {drill.duration && (
                <View style={styles.badgeOutline}>
                  <Clock size={12} color={colors.mutedForeground} />
                  <Text style={styles.badgeOutlineText}>{drill.duration} min</Text>
                </View>
              )}
              {drill.age_group && (
                <View style={styles.badgeOutline}>
                  <GraduationCap size={12} color={colors.mutedForeground} />
                  <Text style={styles.badgeOutlineText}>{drill.age_group}</Text>
                </View>
              )}
            </View>

            {/* Diagram Section */}
            <View style={styles.diagramSection}>
              {/* View Mode Toggle */}
              {drill.has_animation && (
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      viewMode === 'static' && styles.toggleButtonActive,
                    ]}
                    onPress={() => setViewMode('static')}
                  >
                    <ImageIcon
                      size={16}
                      color={viewMode === 'static' ? colors.primaryForeground : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        viewMode === 'static' && styles.toggleTextActive,
                      ]}
                    >
                      Static
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      viewMode === 'animated' && styles.toggleButtonActive,
                    ]}
                    onPress={() => setViewMode('animated')}
                  >
                    <Film
                      size={16}
                      color={viewMode === 'animated' ? colors.primaryForeground : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        viewMode === 'animated' && styles.toggleTextActive,
                      ]}
                    >
                      Animated
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Diagram Image */}
              <View style={styles.diagramContainer}>
                {drill.svg_url ? (
                  <>
                    <Image
                      source={{ uri: drill.svg_url }}
                      style={styles.diagramImage}
                      contentFit="contain"
                      transition={200}
                      onLoadStart={() => setImageLoading(true)}
                      onLoadEnd={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                      <View style={styles.diagramLoading}>
                        <ActivityIndicator size="large" color={colors.primary} />
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.diagramPlaceholder}>
                    <Text style={styles.diagramPlaceholderText}>No diagram available</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Overview Section */}
            {drill.description && (
              <View style={styles.overviewSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>📋</Text>
                  <Text style={styles.sectionTitle}>Overview</Text>
                </View>
                <Text style={styles.overviewText}>{drill.description}</Text>
              </View>
            )}

            {/* Tabbed Content */}
            {hasAnyContent && (
              <View style={styles.tabbedSection}>
                {/* Tab Headers */}
                <View style={styles.tabsHeader}>
                  {hasSetup && (
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'setup' && styles.tabActive]}
                      onPress={() => setActiveTab('setup')}
                    >
                      <ClipboardList
                        size={16}
                        color={activeTab === 'setup' ? colors.foreground : colors.mutedForeground}
                      />
                    </TouchableOpacity>
                  )}
                  {hasInstructions && (
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'instructions' && styles.tabActive]}
                      onPress={() => setActiveTab('instructions')}
                    >
                      <Play
                        size={16}
                        color={activeTab === 'instructions' ? colors.foreground : colors.mutedForeground}
                      />
                    </TouchableOpacity>
                  )}
                  {hasVariations && (
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'variations' && styles.tabActive]}
                      onPress={() => setActiveTab('variations')}
                    >
                      <RefreshCw
                        size={16}
                        color={activeTab === 'variations' ? colors.foreground : colors.mutedForeground}
                      />
                    </TouchableOpacity>
                  )}
                  {hasCoachingPoints && (
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'coaching' && styles.tabActive]}
                      onPress={() => setActiveTab('coaching')}
                    >
                      <Lightbulb
                        size={16}
                        color={activeTab === 'coaching' ? colors.foreground : colors.mutedForeground}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                  {getTabContent()}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, isSaved && styles.actionButtonSecondary]}
                onPress={() => onSave?.(drill)}
              >
                {isSaved ? (
                  <BookmarkCheck size={18} color={colors.foreground} />
                ) : (
                  <Bookmark size={18} color={colors.primaryForeground} />
                )}
                <Text style={[styles.actionButtonText, isSaved && styles.actionButtonTextSecondary]}>
                  {isSaved ? 'Saved' : 'Save to My Drills'}
                </Text>
              </TouchableOpacity>

              {onUseAsTemplate && (
                <TouchableOpacity
                  style={styles.actionButtonOutline}
                  onPress={() => onUseAsTemplate(drill)}
                >
                  <Sparkles size={18} color={colors.primary} />
                  <Text style={styles.actionButtonOutlineText}>Use as Template</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: SCREEN_HEIGHT * 0.92,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: spacing.md,
    paddingRight: 50,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeOutlineText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  diagramSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: colors.primaryForeground,
  },
  diagramContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  diagramImage: {
    width: '100%',
    height: '100%',
  },
  diagramLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagramPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagramPlaceholderText: {
    color: colors.mutedForeground,
    fontSize: 14,
  },
  overviewSection: {
    backgroundColor: 'rgba(74, 157, 110, 0.08)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(74, 157, 110, 0.15)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  overviewText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.mutedForeground,
  },
  tabbedSection: {
    marginBottom: spacing.lg,
  },
  tabsHeader: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.background,
  },
  tabContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bulletItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.foreground,
  },
  paragraphText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
  },
  actionButtonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  actionButtonTextSecondary: {
    color: colors.foreground,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonOutlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
