import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';

const SIZE = 200;
const { width, height } = Dimensions.get('window');

export const RenderWords = ({
  word,
  index,
  translateX,
}: {
  word: string;
  index: number;
  translateX: SharedValue<number>;
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  
  const boxStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      translateX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [height / 2, 0, height / 2],
      Extrapolation.CLAMP,
    );
    
    // We only animate GPU-friendly properties here (transform and opacity)
    return {
      transform: [
        { scale: scale },
        { translateY: translateY },
      ],
      opacity: opacity,
    };
  });

  // Skia handles the border radius natively on the GPU Canvas without triggering layout passes
  const radius = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      inputRange,
      [10, SIZE / 2, 10],
      Extrapolation.CLAMP,
    );
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `rgba(102, 208, 188, ${(index + 1) * 0.15})` },
      ]}
    >
      <Animated.View style={[styles.box, boxStyle]}>
        <View style={StyleSheet.absoluteFill}>
          <Canvas style={{ flex: 1 }}>
            <RoundedRect x={0} y={0} width={SIZE} height={SIZE} r={radius} color="#f87171" />
          </Canvas>
        </View>
        <Text style={styles.text}>{word}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    // Removed native backgroundColor and borderRadius properties
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF2D0',
    textAlign: 'center',
    zIndex: 1, // Keeps text above Skia canvas
  },
});
