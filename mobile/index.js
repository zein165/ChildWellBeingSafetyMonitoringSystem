/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { colors } from './src/shared/constants/theme/colors';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    onSurface: colors.black,
  }
};

export default function Main() {
    return (
        <PaperProvider theme={theme}>
            <App />
        </PaperProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
