import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { SCREENS } from '../constants/screens';
import { Landing } from '../features';

const RootStack = createNativeStackNavigator({
  initialRouteName: SCREENS.LANDING,
  screens: {
    [SCREENS.LANDING]: {
      screen: Landing,
      options: {
        headerShown: false,
      },
    },
  },
});

export const RootNavigation = createStaticNavigation(RootStack);
