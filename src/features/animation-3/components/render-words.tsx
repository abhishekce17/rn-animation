import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

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
    const borderRadius = interpolate(
      translateX.value,
      inputRange,
      [10, SIZE / 2, 10],
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
    return {
      borderRadius,
      transform: [
        {
          scale: scale,
        },
        {
          translateY: translateY,
        },
      ],
      opacity: opacity,
    };
  });
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `rgba(102, 208, 188, ${(index + 1) * 0.15})` },
      ]}
    >
      <Animated.View style={[styles.box, boxStyle]}>
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
    backgroundColor: '#f87171',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF2D0',
    textAlign: 'center',
  },
});
