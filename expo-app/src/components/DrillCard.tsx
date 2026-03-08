import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Bookmark, Clock, Users, Target } from 'lucide-react-native';
import { Drill, getCategoryColor, getDifficultyColor } from '../types/drill';
import { colors, borderRadius, spacing } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = spacing.md;

interface DrillCardProps {
  drill: Drill;
  onPress: (drill: Drill) => void;
  onSave?: (drill: Drill) => void;
  isSaved?: boolean;
}

export function DrillCard({ drill, onPress, onSave, isSaved = false }: DrillCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const categoryColor = getCategoryColor(drill.category);
  const difficultyColor = getDifficultyColor(drill.difficulty);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(drill)}
      activeOpacity={0.8}
    >
      {/* Diagram Image */}
      <View style={styles.imageContainer}>
        {drill.svg_url && !imageError ? (
          <>
            <Image
              source={{ uri: drill.svg_url }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No diagram</Text>
          </View>
        )}

        {/* Bookmark Button */}
        <TouchableOpacity
          style={[styles.bookmarkButton, isSaved && styles.bookmarkButtonSaved]}
          onPress={(e) => {
            e.stopPropagation?.();
            onSave?.(drill);
          }}
        >
          <Bookmark
            size={16}
            color={isSaved ? colors.primaryForeground : colors.mutedForeground}
            fill={isSaved ? colors.primaryForeground : 'transparent'}
          />
        </TouchableOpacity>

        {/* Animated Badge */}
        {drill.has_animation && (
          <View style={styles.animatedBadge}>
            <Text style={styles.animatedDot}>●</Text>
            <Text style={styles.animatedText}>Animated</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {drill.name}
        </Text>

        {/* Tags */}
        <View style={styles.tags}>
          {drill.category && (
            <View style={[styles.tag, { backgroundColor: categoryColor.bg }]}>
              <Text style={[styles.tagText, { color: categoryColor.text }]}>
                {drill.category.toUpperCase()}
              </Text>
            </View>
          )}
          {drill.difficulty && (
            <View style={[styles.tag, { backgroundColor: difficultyColor.bg }]}>
              <Text style={[styles.tagText, { color: difficultyColor.text }]}>
                {drill.difficulty.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        {drill.description && (
          <Text style={styles.description} numberOfLines={2}>
            {drill.description}
          </Text>
        )}

        {/* Meta Info */}
        <View style={styles.meta}>
          {drill.player_count && (
            <View style={styles.metaItem}>
              <Users size={12} color={colors.mutedForeground} />
              <Text style={styles.metaText}>
                {drill.player_count_display || `${drill.player_count}+`}
              </Text>
            </View>
          )}
          {drill.duration && (
            <View style={styles.metaItem}>
              <Clock size={12} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{drill.duration} min</Text>
            </View>
          )}
          {drill.age_group && (
            <View style={styles.metaItem}>
              <Target size={12} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{drill.age_group}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: CARD_MARGIN,
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.fieldDark,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(99, 176, 67, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.mutedForeground,
    fontSize: 14,
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButtonSaved: {
    backgroundColor: colors.primary,
  },
  animatedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  animatedDot: {
    color: colors.accentForeground,
    fontSize: 8,
  },
  animatedText: {
    color: colors.accentForeground,
    fontSize: 11,
    fontWeight: '500',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    color: colors.mutedForeground,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.mutedForeground,
    fontSize: 11,
  },
});
