import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Library, Search, SlidersHorizontal, ChevronDown, LayoutList, LayoutGrid } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';
import { DrillCard } from '../../src/components/DrillCard';
import { DrillDetailModal } from '../../src/components/DrillDetailModal';
import { Drill } from '../../src/types/drill';
import { colors, spacing, borderRadius } from '../../src/theme/colors';

export default function LibraryScreen() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState<1 | 2>(1);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [loadingDrill, setLoadingDrill] = useState(false);

  const fetchDrills = useCallback(async () => {
    try {
      let query = supabase
        .from('drills')
        .select(`
          id,
          name,
          category,
          difficulty,
          description,
          player_count,
          duration,
          age_group,
          svg_url,
          has_animation
        `)
        .order('name');

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
      } else {
        setDrills(data || []);
        setError(null);
      }
    } catch (e: any) {
      console.error('Fetch error:', e);
      setError(e.message);
    }
    setLoading(false);
    setRefreshing(false);
  }, [searchQuery]);

  useEffect(() => {
    fetchDrills();
  }, [fetchDrills]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDrills();
  };

  const handleDrillPress = async (drill: Drill) => {
    setLoadingDrill(true);
    try {
      // Fetch full drill details including setup, instructions, etc.
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .eq('id', drill.id)
        .single();
      
      if (error) {
        console.error('Error fetching drill:', error);
        setSelectedDrill(drill); // Fall back to partial data
      } else {
        setSelectedDrill(data);
      }
    } catch (e) {
      console.error('Error:', e);
      setSelectedDrill(drill);
    }
    setLoadingDrill(false);
  };

  const handleCloseModal = () => {
    setSelectedDrill(null);
  };

  const handleSaveDrill = (drill: Drill) => {
    // TODO: Implement save functionality
    console.log('Save drill:', drill.name);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title Row */}
      <View style={styles.titleRow}>
        <View style={styles.logoContainer}>
          <Library size={20} color={colors.primaryForeground} />
        </View>
        <Text style={styles.title}>Drill Library</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color={colors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search drills..."
          placeholderTextColor={colors.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={fetchDrills}
        />
      </View>

      {/* Filters Button */}
      <TouchableOpacity style={styles.filtersButton}>
        <SlidersHorizontal size={16} color={colors.primary} />
        <Text style={styles.filtersText}>Filters</Text>
        <ChevronDown size={16} color={colors.primary} />
      </TouchableOpacity>

      {/* Results Count & View Toggle */}
      <View style={styles.resultsRow}>
        <View style={styles.resultsCount}>
          <SlidersHorizontal size={14} color={colors.mutedForeground} />
          <Text style={styles.resultsText}>{drills.length} drills found</Text>
        </View>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, gridCols === 1 && styles.toggleButtonActive]}
            onPress={() => setGridCols(1)}
          >
            <LayoutList size={14} color={gridCols === 1 ? colors.primaryForeground : colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, gridCols === 2 && styles.toggleButtonActive]}
            onPress={() => setGridCols(2)}
          >
            <LayoutGrid size={14} color={gridCols === 2 ? colors.primaryForeground : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        {renderHeader()}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading drills...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        {renderHeader()}
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDrills}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (drills.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        {renderHeader()}
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <Library size={32} color={colors.mutedForeground} />
          </View>
          <Text style={styles.emptyTitle}>No drills found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your filters or search criteria.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {renderHeader()}
      
      <FlatList
        data={drills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DrillCard
            drill={item}
            onPress={handleDrillPress}
            onSave={handleSaveDrill}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Loading overlay when fetching drill details */}
      {loadingDrill && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingOverlayText}>Loading drill...</Text>
        </View>
      )}

      {/* Drill Detail Modal */}
      <DrillDetailModal
        drill={selectedDrill}
        isOpen={selectedDrill !== null}
        onClose={handleCloseModal}
        onSave={handleSaveDrill}
      />
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 15,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  filtersText: {
    flex: 1,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resultsText: {
    color: colors.mutedForeground,
    fontSize: 13,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  toggleButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listContent: {
    paddingVertical: spacing.sm,
    paddingBottom: 100, // Extra padding for tab bar
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    color: colors.mutedForeground,
    fontSize: 14,
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.destructive,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryText: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    color: colors.mutedForeground,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 24, 35, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingOverlayText: {
    color: colors.mutedForeground,
    fontSize: 14,
    marginTop: spacing.md,
  },
});
