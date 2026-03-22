import { Canvas, Path, size, Skia } from '@shopify/react-native-skia';
import { useCallback } from 'react';
import {
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const PERCENTAGE_VALUE = [25, 50, 75, 100];

const SIZE = width * 0.7;
const STROKE_WIDTH = 30;
const CENTER = SIZE / 2;

const radius = (SIZE - STROKE_WIDTH) / 2;
const path = Skia.Path.Make();
path.addCircle(CENTER, CENTER, radius);

const matrix = Skia.Matrix();
matrix.translate(CENTER, CENTER);
matrix.rotate(-Math.PI / 2);
matrix.translate(-CENTER, -CENTER);
path.transform(matrix);

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const PressableButton = ({
  title,
  onPress,
}: {
  title: number | string;
  onPress: (v: number) => void;
}) => (
  <Pressable
    onPress={() => onPress((title as number) / 100)}
    style={styles.buttonStyle}
  >
    <Text style={styles.btnTextStyle}>{title}</Text>
  </Pressable>
);

const Animation7 = () => {
  // 1. The Progress Pointer (0 to 1)
  let inputValue = '10';
  const progress = useSharedValue(0.1); // 30% complete

  const handlePress = (v: number) => {
    progress.value = withTiming(v, {
      duration: 600,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const handleRunPress = () => {
    const numericValue = parseInt(inputValue, 10);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      // Invalid input, you can show an alert or simply return
      return;
    }
    handlePress(numericValue / 100);
  };

  const animatedTextProps = useAnimatedProps(() => {
    const percentage = Math.round(progress.value * 100);
    return {
      text: `${percentage}%`,
      defaultValue: `${percentage}%`,
    } as any;
  });

  return (
    <View style={styles.container}>
      <View style={styles.canvasWrapper}>
        <Canvas style={[styles.canvas, StyleSheet.absoluteFill]}>
          {/* Background Track */}
          <Path
            path={path}
            color="#afafaf"
            style="stroke"
            strokeWidth={STROKE_WIDTH}
          />

          {/* Foreground Animated Progress */}
          <Path
            path={path}
            color="#b913cb"
            style="stroke"
            strokeWidth={STROKE_WIDTH - 5}
            strokeCap="round" // Perfect native rounded edges instantly
            start={0}
            end={progress} // Directly drive the stroke trim with the shared value!
          />
        </Canvas>
        <AnimatedTextInput
          editable={false}
          animatedProps={animatedTextProps}
          style={styles.percentageText}
        />
      </View>
      <View style={styles.buttonsContainer}>
        {PERCENTAGE_VALUE.map(v => (
          <PressableButton title={v} onPress={handlePress} key={v} />
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="0 - 100"
          maxLength={3}
          numberOfLines={1}
          defaultValue={inputValue}
          onChangeText={txt => (inputValue = txt)}
          placeholderTextColor="#d0d0d0"
        />
        <PressableButton title="Run" onPress={handleRunPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    gap: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.8)',
  },
  canvas: {
    flex: 1,
  },
  buttonStyle: {
    backgroundColor: '#b913cb',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 5,
  },
  btnTextStyle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: '3%',
  },
  percentageText: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    padding: 0, // Removes default Android TextInput padding
    margin: 0,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#b913cb64',
    borderColor: '#b913cb',
    borderWidth: 3,
    width: width * 0.5,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Animation7;
