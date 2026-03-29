import { StyleSheet, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface BoxProps {
  index: number;
  progress: SharedValue<number>;
}

const SQUARE_SIZE = 10;
const N = 12;

const Box = ({ index, progress }: BoxProps) => {
  const offsetAngle = (2 * Math.PI) / N;
  const angle = (N - 1 - index) * offsetAngle;
  const rotate = useDerivedValue(() => {
    if (progress.value <= 2*Math.PI) {
        return Math.min(progress.value, angle);
    }
    return Math.max(progress.value - 2*Math.PI, angle);
  }, []);
  const translateY = useDerivedValue(() => {
    if(rotate.value == angle) {
      return withSpring(-(N * SQUARE_SIZE), { stiffness: 100, damping: 25 });
    }
    if(progress.value > 2*Math.PI) {
        return withTiming((index - N) * SQUARE_SIZE);
    }
    return withTiming(-index * SQUARE_SIZE);
  });

  const boxStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}rad` }, { translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.boxStyle,
        boxStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: '#fff',
    position: 'absolute',
  },
});

export default Box;
