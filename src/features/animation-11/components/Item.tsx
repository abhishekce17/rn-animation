import { memo } from 'react';
import { StyleSheet, ViewToken } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

export const EachItem = memo(
  ({
    id,
    viewableItems,
  }: {
    id: number;
    viewableItems: SharedValue<ViewToken[]>;
  }) => {
      const animatedStyle = useAnimatedStyle(() => {
          const isViewable = viewableItems.value.some((item) => item.isViewable && item.item === id);
      return {
        opacity: withTiming(isViewable ? 1 : 0.5),
        transform: [{ scale : withTiming(isViewable ? 1 : 0.5)}],
        };
    }, []);
    return (
      <Animated.View
        entering={ZoomIn}
        exiting={ZoomOut}
        style={[styles.container, animatedStyle]}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#33a398',
    marginVertical: 10,
  },
});
