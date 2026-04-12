import { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Image } from 'react-native';

import { useChildrenStore } from '../../../store/childrenStore';
import { applicationInventoryService } from '../../../services/application-inventory/applicationInventoryService';
import {
  Application,
  ApplicationStatus,
} from '../../../shared/types/application';

import { colors } from '../../../shared/constants/theme/colors';
import { spacing } from '../../../shared/constants/theme/spacing';

import AppScreenContainer from '../../../shared/components/app/AppScreenContainer';
import AppPageHeader from '../../../shared/components/app/AppPageHeader';

import { useSnackbarStore } from '../../../store/ui/snackbarStore';

import SegmentedControl from '../../../shared/components/ui/SegmentedControl';
import Card from '../../../shared/components/ui/Card';
import Text from '../../../shared/components/ui/Text';
import ActivityIndicator from '../../../shared/components/ui/ActivityIndicator';
import Icon from '../../../shared/components/ui/Icon';


export default function ApplicationInventoryScreen() {
  const { activeChild } = useChildrenStore();
  const { showSnackbar } = useSnackbarStore();

  const [applications, setApplications] = useState<Application[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filterOptions = [
    { label: 'Installed', value: 'installed' },
    { label: 'Uninstalled', value: 'uninstalled' },
  ];

  const [filterOption, setFilterOption] = useState(filterOptions[0].value);

  const fetchApplications = useCallback(
    async (isRefresh = false) => {
      if (!activeChild?.id) return;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await applicationInventoryService.getApplicationByChild(activeChild.id);
        setApplications(response.data.applications);
      } catch (error: any) {
        showSnackbar('Failed to fetch applications');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeChild?.id],
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = applications
    .filter(app => {
      const status =
        filterOption === 'installed'
          ? ApplicationStatus.INSTALLED
          : ApplicationStatus.REMOVED;
      return app.status === status;
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const renderItem = ({ item }: { item: Application }) => (
    <Card variant="elevated" padding={spacing.sm}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}>
          <Icon name="apps" size={32} color={colors.primary} />
        </View>
        <View style={{
          flex: 1,
        }}>
          <Text variant="bold" size="md" color={colors.black}>
            {item.name}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <AppScreenContainer>
      <View style={{ flex: 1, gap: spacing.lg }}>
        <AppPageHeader
          title="Application Inventory"
          subtitle="Monitor and manage installed apps"
        />

        <SegmentedControl
          options={filterOptions}
          value={filterOption}
          onChange={setFilterOption}
        />

        {loading && !refreshing ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ActivityIndicator toggle={loading} />
            <Text color={colors.secondary}>Fetching applications...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredApplications}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1,
              gap: spacing.md,
              justifyContent: filteredApplications.length === 0 ? 'center' : 'flex-start',
            }}
            onRefresh={() => fetchApplications(true)}
            refreshing={refreshing}
            ListEmptyComponent={
              <View style={{
                alignItems: 'center',
              }}>
                <Icon name="search-off" size={64} color={colors.secondary} />
                <Text
                  variant="semibold"
                  size="lg"
                  color={colors.secondary}
                >
                  No applications found
                </Text>
                <Text variant="regular" size="sm" color={colors.secondary}>
                  Try changing the filter or refresh the page
                </Text>
              </View>
            }
          />
        )}
      </View>
    </AppScreenContainer>
  );
}
