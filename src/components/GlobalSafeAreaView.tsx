import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ViewStyle,
  StatusBarStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  unsafeTop?: boolean; // True if a product image needs to go under the notch
  unsafeBottom?: boolean; // True if you want to ignore the bottom home indicator
}

export const GlobalSafeAreaView = ({
  children,
  style,
  backgroundColor = '#ffffff',
  barStyle = 'default',
  unsafeTop = false,
  unsafeBottom = false,
}: ScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor }, // Apply dynamic background
        {
          // Apply padding ONLY if we want it to be "safe"
          paddingTop: unsafeTop ? 0 : insets.top,
          paddingBottom: unsafeBottom ? 0 : insets.bottom,
        },
        style, // Allow custom styles to override
      ]}
    >
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
