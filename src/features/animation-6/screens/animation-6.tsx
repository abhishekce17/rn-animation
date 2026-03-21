import { Dimensions, StyleSheet, View } from 'react-native';
import { ColorPicker } from '../components/color-picker';
import { vec } from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const COLORS = [
  'red',
  'purple',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'black',
  'white',
];

const BACKGROUND_COLORS = 'rgb(0, 0, 0, 0.8)';

const { width } = Dimensions.get('window');
const calculatedWidth = width * 0.9;

const animation6 = () => {
  const activeColor = useSharedValue('#ff0000');
  const topCircleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: activeColor.value,
    };
  });
  return (
    <>
      <View style={styles.topContainer}>
        <Animated.View style={[styles.topCirlce, topCircleStyle]} />
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={vec(0, 128)}
          end={vec(calculatedWidth, 128)}
          width={calculatedWidth}
          style={styles.gradientCanvas}
          selectedColor={activeColor}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topCirlce: {
    width: calculatedWidth * 0.8,
    height: calculatedWidth * 0.8,
    borderRadius: calculatedWidth * 0.4,
    backgroundColor: 'white',
  },
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLORS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientCanvas: {
    width: calculatedWidth,
    height: 40,
  },
});

export default animation6;
