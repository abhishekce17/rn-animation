import { translate } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const SIZE = 200;

export default function Animation4() {
  // 1. One master driver for the entire 3D object
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Spin it infinitely to prove the 3D structure is solid
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  // 2. Front Face (0 degrees)
  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value}deg` },
      // { translateZ: SIZE / 2 }, // Push outward!
    ],
  }));

  // 3. Back Face (180 degrees)
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value + 180}deg` }, // Offset by 180
      // { translateZ: SIZE / 2 },
    ],
  }));

  // 4. Right Face (90 degrees)
  const rightStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value + 90}deg` }, // Offset by 90
      // { translateZ: SIZE / 2 },
    ],
  }));

  // 5. Left Face (-90 degrees)
  const leftStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value - 90}deg` }, // Offset by -90
      // { translateZ: SIZE / 2 },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Notice absoluteFill! They all start perfectly stacked in the center */}
      <Animated.View style={[styles.baseBox, styles.box1, frontStyle]} />
      <Animated.View style={[styles.baseBox, styles.box2, rightStyle]} />
      <Animated.View style={[styles.baseBox, styles.box3, backStyle]} />
      <Animated.View style={[styles.baseBox, styles.box4, leftStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111', // Dark background makes 3D pop
  },
  baseBox: {
    width: SIZE,
    height: SIZE,
    position: 'absolute', // CRITICAL: They must stack on top of each other
    backfaceVisibility: 'hidden', // Hides the inside of the box
    opacity: 0.9, // Slight transparency so you can see the 3D shape better
    borderWidth: 2,
    borderColor: '#fff', // Wireframe effect
  },
  box1: { backgroundColor: '#ef4444' }, // Red
  box2: { backgroundColor: '#3b82f6' }, // Blue
  box3: { backgroundColor: '#10b981' }, // Green
  box4: { backgroundColor: '#eab308' }, // Yellow
});
