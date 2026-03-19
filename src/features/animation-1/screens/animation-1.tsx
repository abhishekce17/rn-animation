import React from 'react';
import { StyleSheet, View, Pressable, Text, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

// ------------------------------------------------------------------
// 1. THE LOGICAL ABSTRACTION (Custom Hook)
// ------------------------------------------------------------------
export function useFlipState() {
  // Logical state: What the user actually wants (True = Back, False = Front)
  const isFlipped = useSharedValue(false);
  // Visual state: The exact mathematical progress of the animation (0 to 1)
  const progress = useSharedValue(0);

  const toggleFlip = () => {
    isFlipped.value = !isFlipped.value;

    // The physics engine targets the logical state, regardless of current resting position
    progress.value = withSpring(isFlipped.value ? 1 : 0, {
      mass: 0.8,
      damping: 15,
      stiffness: 120,
      overshootClamping: false,
    });
  };

  return { progress, toggleFlip };
}

// ------------------------------------------------------------------
// 2. THE UI ABSTRACTION (Reusable Component)
// ------------------------------------------------------------------
interface FlipCardProps {
  FrontComponent: React.ReactNode;
  BackComponent: React.ReactNode;
  style?: ViewStyle;
}

export function FlipCard({
  FrontComponent,
  BackComponent,
  style,
}: FlipCardProps) {
  const { progress, toggleFlip } = useFlipState();

  const frontStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(progress.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateX: `${rotateX}deg` }],
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(progress.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateX: `${rotateX}deg` }],
    };
  });

  return (
    <Pressable onPress={toggleFlip} style={[styles.cardContainer, style]}>
      <View style={StyleSheet.absoluteFill}>
        {/* Front Face */}
        <Animated.View style={[styles.cardBase, frontStyle]}>
          {FrontComponent}
        </Animated.View>

        {/* Back Face (Absolutely positioned to perfectly overlap the front) */}
        <Animated.View
          style={[styles.cardBase, styles.cardBackAbsolute, backStyle]}
        >
          {BackComponent}
        </Animated.View>
      </View>
    </Pressable>
  );
}

// ------------------------------------------------------------------
// 3. IMPLEMENTATION (Example Dashboard Screen)
// ------------------------------------------------------------------
export default function CardFlip() {
  return (
    <View style={styles.screen}>
      <FlipCard
        style={{ width: 320, height: 180 }}
        FrontComponent={
          <View style={[styles.face, styles.frontFace]}>
            <Text style={styles.text}>Front</Text>
          </View>
        }
        BackComponent={
          <View style={[styles.face, styles.backFace]}>
            <Text style={styles.text}>Back</Text>
          </View>
        }
      />
    </View>
  );
}

// ------------------------------------------------------------------
// STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
  },
  cardContainer: {
    // The width/height are controlled via the style prop on the component
  },
  cardBase: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden', // The critical property for the 3D illusion
    borderRadius: 16,
  },
  cardBackAbsolute: {
    // Ensures the back face starts pre-rotated to face away from the camera
  },
  face: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontFace: {
    backgroundColor: '#00a3e0', // Royal Peacock
  },
  backFace: {
    backgroundColor: '#663399', // Royal Purple
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
