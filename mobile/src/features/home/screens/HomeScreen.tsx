import { ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';

import { colors } from '../../../shared/constants/theme/colors';
import { spacing } from '../../../shared/constants/theme/spacing';
import { Images } from '../../../assets/images'

import { useHomeData } from '../hooks/useHomeData';

import Text from '../../../shared/components/ui/Text';
import Card from '../../../shared/components/ui/Card';
import Header from '../../../shared/components/layout/screens/Header';
import CustomProgressBar from '../../../shared/components/ui/CustomProgressBar';
import Button from '../../../shared/components/ui/Button';

export default function HomeScreen() {
  const { WEEKLY_DATA, TOP_APPS, totalScreenTime } = useHomeData()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background
      }}
    >
      <ScrollView
        contentContainerStyle={{ gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: spacing.md
          }}>
          <View
            style={{
              gap: spacing.lg,
              paddingHorizontal: spacing.lg
            }}>
            <Card
              variant="default"
              padding={16}
              borderRadius={12}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                  marginBottom: 16
                }}>
                <IconButton
                  icon="clock-outline"
                  size={20}
                  style={{ margin: 0, padding: 0 }}
                  iconColor={colors.textBody} />
                <Text
                  size="sm"
                  color={colors.textBody}
                  variant="bold">Screen Time</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  gap: 4
                }}>
                <Text
                  size="displayLg"
                  variant="bold"
                  color={colors.textHeading}>
                  4
                </Text>
                <Text
                  size="md"
                  color={colors.textBody}>
                  h
                </Text>
                <Text
                  size="displayLg"
                  variant="bold"
                  color={colors.textHeading}>
                  12
                </Text>
                <Text
                  size="md"
                  color={colors.textBody}>
                  m
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                <IconButton
                  icon="arrow-bottom-right"
                  size={16}
                  iconColor={colors.successText}
                  style={{ margin: 0, width: 20 }}
                />
                <Text
                  size="sm"
                  color={colors.successText}
                  variant="regular">
                  15% less than yesterday
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  height: 100
                }}>
                {WEEKLY_DATA.map((item) => (
                  <View
                    key={item.day}
                    style={{
                      alignItems: 'center', gap: spacing.sm
                    }}>
                    <View
                      style={{
                        width: 36,
                        height: item.value,
                        backgroundColor: item.active ? colors.purple : colors.grey,
                        borderRadius: 10
                      }} />
                    <Text size="xs"
                      color={colors.textBody}>
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>

            <Card
              variant="default"
              padding={16}
              borderRadius={12}
              style={{ flex: 1 }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <IconButton
                  icon="view-grid-outline"
                  size={20} style={{ margin: 0 }}
                  iconColor={colors.textBody}
                />
                <Text
                  size="sm"
                  color={colors.textBody}
                  variant="bold"
                >
                  Usage Classification
                </Text>
              </View>

              <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
                <View style={{ flex: 4, backgroundColor: colors.blue }} />
                <View style={{ flex: 3, backgroundColor: colors.purple }} />
                <View style={{ flex: 2, backgroundColor: colors.green }} />
                <View style={{ flex: 1, backgroundColor: colors.grey }} />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blue }} />
                  <Text size="xs" color={colors.textBody}>Games (1h 53m)</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.purple }} />
                  <Text size="xs" color={colors.textBody}>Social (1h 40m)</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green }} />
                  <Text size="xs" color={colors.textBody}>Edu (42m)</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.grey }} />
                  <Text size="xs" color={colors.textBody}>others</Text>
                </View>
              </View>
            </Card>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <IconButton icon="poll" size={24} iconColor={colors.primary} style={{ margin: 0 }} />
                <Text size="lg" variant="bold" color={colors.textHeading}>Top Apps Today</Text>
              </View>
              <Button
                variant="text"
                title="See all"
                onPress={() => console.log('See all top apps pressed')}
                contentStyle={{ paddingHorizontal: 0 }}
                style={{ margin: 0 }}
                labelStyle={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  color: colors.primary,
                }}
              />
            </View>

            <Card variant="default" padding={16} borderRadius={12} style={{ flex: 1 }}>
              <View style={{ gap: 24 }}>
                {TOP_APPS.map((app) => (
                  <View key={app.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <Image source={{ uri: app.icon }} style={{ width: 48, height: 48, borderRadius: 12 }} />

                    <View style={{ flex: 1, gap: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text size="md" variant="bold" color={colors.textHeading}>{app.name}</Text>
                        <Text size="sm" color={colors.textBody}>{app.time}</Text>
                      </View>
                      <CustomProgressBar progress={app.progress} color={app.color} />
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
