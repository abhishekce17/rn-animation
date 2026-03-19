import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { SCREENS } from '../constants/screens';
import {
  Animation1,
  Animation5,
  Animation4,
  Animation3,
  Animation2,
  Landing,
} from '../features';

const RootStack = createNativeStackNavigator({
  initialRouteName: SCREENS.LANDING,
  screens: {
    [SCREENS.LANDING]: {
      screen: Landing,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.Animation1]: { screen: Animation1 },
    [SCREENS.Animation2]: { screen: Animation2 },
    [SCREENS.Animation3]: { screen: Animation3 },
    [SCREENS.Animation4]: { screen: Animation4 },
    [SCREENS.Animation5]: { screen: Animation5 },
  },
});

export const RootNavigation = createStaticNavigation(RootStack);
