import { Dimensions, StyleSheet, View } from 'react-native';
import { ColorPicker } from '../components/color-picker';
import { vec } from '@shopify/react-native-skia';

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
  return (
    <>
      <View style={styles.topContainer}></View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={vec(0, 128)}
          end={vec(calculatedWidth, 128)}
          width={calculatedWidth}
          style={styles.gradientCanvas}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: '#fff',
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
