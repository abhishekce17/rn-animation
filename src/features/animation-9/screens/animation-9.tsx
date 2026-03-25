import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  clamp,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Cross, Plus, Minus } from '../../../assets/svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useState } from 'react';
import { scheduleOnRN } from 'react-native-worklets';

const PILL_WIDTH = 220;
const PILL_HEIGHT = 66; 
const ICON_CONTAINER_SIZE = 50;
const DRAG_OFFSET = 14;

// GEOMETRY BOUNDARIES
const MAX_DRAG_X = PILL_WIDTH / 2 - ICON_CONTAINER_SIZE + DRAG_OFFSET;
const MAX_DRAG_Y = 80; 

// LOGIC THRESHOLDS
const X_ACTION_THRESHOLD = MAX_DRAG_X - 15;
const Y_ACTION_THRESHOLD = PILL_HEIGHT / 2 + 10; 

const Animation9 = () => {
  const [counter, setCounter] = useState(10);
  
  // Physics States
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const pillTranslateXY = useSharedValue({ x: 0, y: 0 });

  // 1. ISOLATED OPACITY SCALARS (Thread Safe)
  const plusOpacity = useSharedValue(1);
  const minusOpacity = useSharedValue(1);
  const crossOpacity = useSharedValue(0);

  const incrementCounter = () => setCounter(prev => prev + 1);
  const decrementCounter = () => setCounter(prev => prev - 1);
  const resetCounter = () => setCounter(0);

  const panGesture = Gesture.Pan()
    .onChange(event => {
      // Hardware clamps for visual boundaries
      translateX.value = clamp(event.translationX, -MAX_DRAG_X, MAX_DRAG_X);
      translateY.value = clamp(event.translationY, -MAX_DRAG_Y, MAX_DRAG_Y);

      pillTranslateXY.value = {
        x: translateX.value * 0.1,
        y: translateY.value * 0.1,
      };

      // 2. THE OPACITY MATRIX
      const absoluteY = Math.abs(event.translationY);

      // Cross ONLY fades in based on Y movement
      crossOpacity.value = interpolate(
        absoluteY, 
        [0, Y_ACTION_THRESHOLD], 
        [0, 1], 
        Extrapolation.CLAMP
      );

      // Calculate how much things should fade based on vertical movement
      const yFadeOut = interpolate(absoluteY, [0, Y_ACTION_THRESHOLD], [1, 0], Extrapolation.CLAMP);
      
      // Calculate X fades
      const rightFadeOut = interpolate(event.translationX, [0, X_ACTION_THRESHOLD], [1, 0], Extrapolation.CLAMP);
      const leftFadeOut = interpolate(event.translationX, [-X_ACTION_THRESHOLD, 0], [0, 1], Extrapolation.CLAMP);

      // Plus fades out if dragging Right OR if dragging Up/Down
      plusOpacity.value = Math.min(yFadeOut, rightFadeOut);
      
      // Minus fades out if dragging Left OR if dragging Up/Down
      minusOpacity.value = Math.min(yFadeOut, leftFadeOut);
    })
    .onFinalize(event => {
      // 3. REINSTATED PRIORITY CASCADE (Kills the invisible X-overshoot bug)
      // Top Priority: Y-Axis (Reset)
      if (event.translationY < -Y_ACTION_THRESHOLD || event.translationY > Y_ACTION_THRESHOLD) {
        scheduleOnRN(resetCounter);
      } 
      // Secondary Priority: X-Axis (Plus/Minus)
      else if (event.translationX < -X_ACTION_THRESHOLD) {
        scheduleOnRN(incrementCounter);
      } 
      else if (event.translationX > X_ACTION_THRESHOLD) {
        scheduleOnRN(decrementCounter);
      }

      // 4. RESET ALL PHYSICS AND OPACITIES
      translateX.value = withSpring(0, { stiffness: 400, damping: 40 });
      translateY.value = withSpring(0, { stiffness: 400, damping: 40 });
      pillTranslateXY.value = withSpring({ x: 0, y: 0 }, { stiffness: 400, damping: 40 });
      
      plusOpacity.value = withSpring(1, { stiffness: 400, damping: 40 });
      minusOpacity.value = withSpring(1, { stiffness: 400, damping: 40 });
      crossOpacity.value = withSpring(0, { stiffness: 400, damping: 40 });
    });

  // Animated Styles
  const crossIconStyle = useAnimatedStyle(() => ({
    opacity: crossOpacity.value,
  }));

  const plusIconStyle = useAnimatedStyle(() => ({
    opacity: plusOpacity.value,
  }));
  
  const minusIconStyle = useAnimatedStyle(() => ({
    opacity: minusOpacity.value,
  }));

  const counterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillTranslateXY.value.x }, { translateY: pillTranslateXY.value.y }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.counterPill, pillStyle]}>
          <Animated.View style={styles.actionIcons}>
            {/* Applied specific styles to specific icons */}
            <Animated.View style={[styles.eachIcon, plusIconStyle]}>
              <Plus height={28} width={28} color="#fff" />
            </Animated.View>
            <Animated.View style={[styles.eachIcon, crossIconStyle]}>
              <Cross height={28} width={28} color="#fff" />
            </Animated.View>
            <Animated.View style={[styles.eachIcon, minusIconStyle]}>
              <Minus height={21} width={28} color="#fff" />
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.counterContainer, counterStyle]}>
            <Text style={styles.counterText}>{counter}</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterPill: {
    height: PILL_HEIGHT, 
    width: PILL_WIDTH,
    backgroundColor: '#3b3b3b',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  eachIcon: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 50,
    backgroundColor: '#ff0000e7', // Note: Depending on your SVG, this red background might look weird fading out. Consider placing this on the parent.
  },
  counterContainer: {
    height: ICON_CONTAINER_SIZE,
    width: ICON_CONTAINER_SIZE,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    position: 'absolute',
  },
  counterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Animation9;