import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREENS } from '../constants/screens';
import {
  Animation1,
  Animation5,
  Animation4,
  Animation3,
  Animation2,
  Landing,
  Animation6,
  Animation7,
  Animation8,
  Animation9,
  Animation10,
  Animation11,
  Animation12,
} from '../features';

const CustomHeader = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{route.name}</Text>
      <View style={styles.spacer} />
    </View>
  );
};

const RootStack = createNativeStackNavigator({
  initialRouteName: SCREENS.LANDING,
  screenOptions: {
    header: props => <CustomHeader {...props} />,
  },
  screens: {
    [SCREENS.LANDING]: {
      screen: Landing,
      options: { headerShown: false },
    },
    [SCREENS.Animation1]: { screen: Animation1 },
    [SCREENS.Animation2]: { screen: Animation2 },
    [SCREENS.Animation3]: { screen: Animation3 },
    [SCREENS.Animation4]: { screen: Animation4 },
    [SCREENS.Animation5]: { screen: Animation5 },
    [SCREENS.Animation6]: { screen: Animation6 },
    [SCREENS.Animation7]: { screen: Animation7 },
    [SCREENS.Animation8]: { screen: Animation8 },
    [SCREENS.Animation9]: { screen: Animation9 },
    [SCREENS.Animation10]: { screen: Animation10 },
    [SCREENS.Animation11]: { screen: Animation11},
    [SCREENS.Animation12]: { screen: Animation12},
  },
});

export const RootNavigation = createStaticNavigation(RootStack);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    paddingVertical: 8,
    width: 60,
    justifyContent: 'center',
    paddingBottom: 2, // Slight nudge upward since large emojis/symbols are top-heavy
  },
  backText: {
    fontSize: 40,
    fontWeight: '600',
    lineHeight: 40,
    includeFontPadding: false,
    textAlignVertical: 'center',
    transform: [{ translateY: -8 }], // Optically moves the glyph up by 4 pixels to align with adjacent text cap height
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  spacer: {
    width: 60,
  },
});
