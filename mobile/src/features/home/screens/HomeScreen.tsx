import { SafeAreaView } from 'react-native-safe-area-context';

import Text from '../../../shared/components/ui/Text';

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Welcome to home section</Text>
    </SafeAreaView>
  );
}
