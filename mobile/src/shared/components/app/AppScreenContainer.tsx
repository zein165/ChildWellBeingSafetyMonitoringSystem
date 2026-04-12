import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../constants/theme/colors';
import { spacing } from '../../constants/theme/spacing';

import { useChildrenStore } from '../../../store/childrenStore';

import Icon from '../ui/Icon';
import Text from '../ui/Text';
import ActivityIndicator from '../ui/ActivityIndicator';

type Props = {
  children: React.ReactNode;
};

export default function AppScreenContainer({ children }: Props) {
  const { activeChild, loading } = useChildrenStore();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      {loading ? <ActivityIndicator toggle={loading} /> : activeChild ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, gap: spacing.lg }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
          <Icon name="account-search-outline" size={64} color={colors.textBody} />
          <View style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <Text size="lg" variant="bold" color={colors.textHeading}>
              No Child Account Selected
            </Text>
          </View>
          <View style={{ marginTop: spacing.xs, alignItems: 'center' }}>
            <Text size="sm" color={colors.textBody}>
              Please create and select a child account to view monitoring data.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
