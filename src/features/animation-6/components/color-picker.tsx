import {
  Canvas,
  LinearGradient,
  LinearGradientProps,
  RoundedRect,
} from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ColorPickerProps extends LinearGradientProps {
  style?: any;
  width: number;
  selectedColor: SharedValue<string>;
}

export const ColorPicker = ({
  style,
  width,
  selectedColor,
  ...props
}: ColorPickerProps) => {
  // 1. The High-Speed Delta Driver (Isolated)
  const translateX = useSharedValue(0);

  // 2. The Physics State Struct (Grouped)
  const popState = useSharedValue({ y: 0, scale: 1 });

  const MAX_TRANSLATE_X = width - 40;

  const derivedColor = useDerivedValue(() => {
    const color = withTiming(
      interpolateColor(
        translateX.value,
        props.colors.map(
          (_, i) => (i / (props.colors.length - 1)) * MAX_TRANSLATE_X,
        ),
        props.colors as string[],
      ),
      { duration: 150 },
    );
    return color;
  });

  const pickerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        // Read from the grouped physics struct
        { translateY: popState.value.y },
        { scale: popState.value.scale },
      ],
    };
  });

  useAnimatedReaction(
    () => derivedColor.value,
    (newColor, previousColor) => {
      if (newColor !== previousColor) {
        // Direct GPU memory mutation! Zero bridge crossings.
        selectedColor.value = newColor;
      }
    },
  );

  const internalPickerStyle = useAnimatedStyle(() => {
    // const bgColor = `hsl(${
    //   (translateX.value / MAX_TRANSLATE_X) * 360
    // }, 100%, 50%)`; // In this logic i dont need interpolateColor because the color is directly derived from the translateX value, which is already being clamped to the range of 0 to MAX_TRANSLATE_X. The hue is calculated as a direct proportion of translateX to MAX_TRANSLATE_X, resulting in a smooth transition through the color spectrum as the thumb moves.

    // const bgColor = interpolateColor(
    //   translateX.value,
    //   props.colors.map(
    //     (_, i) => (i / (props.colors.length - 1)) * MAX_TRANSLATE_X,
    //   ),
    //   props.colors as string[],
    // );
    return {
      backgroundColor: derivedColor.value,
    };
  });

  const panGesture = Gesture.Pan()
    .onBegin(event => {
      // 1. onBegin fires instantly on touch (even for a quick tap)
      // We animate the thumb smoothly to the exact tap location.
      translateX.value = withTiming(
        Math.max(0, Math.min(event.x - 20, MAX_TRANSLATE_X)),
        { duration: 300 },
      );

      // Fire the pop-up spring
      popState.value = withSpring(
        { y: -50, scale: 1.2 },
        { damping: 20, stiffness: 300 },
      );
    })
    .onChange(event => {
      // 2. Absolute Tracking: We drop `changeX` entirely.
      // If the user drags, we cancel the withTiming animation
      // and map the thumb directly to the absolute X coordinate of the finger.
      translateX.value = Math.max(0, Math.min(event.x - 20, MAX_TRANSLATE_X));
    })
    .onEnd(() => {
      popState.value = withSpring({ y: 0, scale: 1 });
    })
    .onFinalize(() => {
      // This is guaranteed to fire when the finger leaves the screen,
      // instantly reverting the state machine back to zero.
      popState.value = withSpring({ y: 0, scale: 1 });
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width }]}>
        <Canvas style={[style, { width, height: 40 }]}>
          <RoundedRect x={0} y={0} width={width} height={40} r={20}>
            <LinearGradient {...props} />
          </RoundedRect>
        </Canvas>
        <Animated.View style={[styles.picker, pickerStyle]}>
          <Animated.View style={[styles.internalPicker, internalPickerStyle]} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 40,
  },
  picker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  internalPicker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'lightgray',
  },
});
