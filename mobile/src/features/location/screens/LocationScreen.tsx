import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../../shared/constants/theme/colors';
import { spacing } from '../../../shared/constants/theme/spacing';
import { useChildrenStore } from '../../../store/childrenStore';
import { locationService, LocationHistoryItem } from '../services/locationService';

import Text from '../../../shared/components/ui/Text';
import Card from '../../../shared/components/ui/Card';
import Icon from '../../../shared/components/ui/Icon';
import { LocationMap } from '../components/LocationMap';
import AppScreenContainer from '../../../shared/components/app/AppScreenContainer';
import AppPageHeader from '../../../shared/components/app/AppPageHeader';

const HistoryItem = ({ item }: { item: LocationHistoryItem }) => {
  const [address, setAddress] = useState<string>('Resolving address...');

  useEffect(() => {
    let isMounted = true;
    const resolve = async () => {
      const addr = await locationService.reverseGeocode(item.latitude, item.longitude);
      if (isMounted) setAddress(addr);
    };
    resolve();
    return () => { isMounted = false; };
  }, [item.latitude, item.longitude]);

  const time = new Date(item.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIconContainer}>
        <View style={styles.historyLine} />
        <View style={styles.historyDot} />
      </View>
      <View style={styles.historyContent}>
        <View style={styles.historyHeader}>
          <Text variant="bold" size="md" color={colors.textHeading}>
            {time}
          </Text>
          <Text variant="regular" size="xs" color={colors.textBody}>
            {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
          </Text>
        </View>
        <Text variant="regular" size="sm" color={colors.textBody}>
          {address}
        </Text>
      </View>
    </View>
  );
};

export const LocationScreen = () => {
  const { activeChild } = useChildrenStore();
  const [history, setHistory] = useState<LocationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!activeChild) return;
    try {
      const data = await locationService.getHistory(activeChild.id);
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch location history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeChild]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (!activeChild) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text>Please select a child first</Text>
      </SafeAreaView>
    );
  }

  const latestLocation = history.length > 0 ? history[history.length - 1] : null;

  return (
    <AppScreenContainer>
      <View style={{ flex: 1, gap: spacing.lg }}>
        <AppPageHeader
          title="Location"
          subtitle="Track current posistion and history"
        />

        <ScrollView
          contentContainerStyle={{
            gap: spacing.lg,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
            {loading ? (
              <View style={styles.mapPlaceholder}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : latestLocation ? (
                <Card variant='elevated' padding={spacing.md}>
                    <LocationMap
                        latitude={latestLocation.latitude}
                        longitude={latestLocation.longitude}
                        history={history}
                    />
                </Card>
            ) : (
                <Card style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderStyle: 'dashed',
                    borderWidth: 1,
                    borderColor: colors.border,
                    gap: spacing.md
                }}>
                  <Icon name="map-marker-off" size={48} color={colors.grey} />
                  <Text size="md" color={colors.textBody}>
                    No location data available for today
                  </Text>
                </Card>
            )}
            
            <View style={{
                gap: spacing.md
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Icon name="clock-alert-outline" color={colors.icon} />
                        <Text variant="bold" size="lg" color={colors.textHeading}>
                            Location History
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onRefresh}>
                        <Text variant="bold" size="sm" color={colors.primary}>Refresh</Text>
                    </TouchableOpacity>
                </View>

                <Card variant="default" style={styles.historyCard}>
                    {sortedHistory.length > 0 ? (
                    sortedHistory.map((item) => (
                        <HistoryItem key={item.id} item={item} />
                    ))
                    ) : (
                    <View style={{ alignItems: 'center' }}>
                        <Text color={colors.textBody}>No history items yet</Text>
                    </View>
                    )}
                </Card>
            </View>
        </ScrollView>
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    gap: 4,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: colors.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyCard: {
    padding: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  historyIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  historyLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.border,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 8,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1,
  },
  historyContent: {
    flex: 1,
    marginLeft: spacing.md,
    paddingBottom: spacing.lg,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
