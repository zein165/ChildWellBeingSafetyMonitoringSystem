import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/app/navigation/RootNavigator.tsx';

import Snackbar from './src/shared/components/ui/Snackbar.tsx';

import { useSnackbarStore } from './src/store/ui/snackbarStore.ts';

function GlobalSnackbar() {
  const { visible, message, timeout, hideSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      visible={visible}
      text={message}
      duration={timeout}
      onDismiss={hideSnackbar}
    />
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
      <GlobalSnackbar />
    </SafeAreaProvider>
  );
}

export default App;
