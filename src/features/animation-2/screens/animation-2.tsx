import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SIZE = 80;
const RADIUS = 150;

const panGesture = Gesture.Pan();

const Animation2 = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // .onStart(event => {
  //   translateX.value = event.translationX;
  //   translateY.value = event.translationY;
  // })
  panGesture
    .onChange(event => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onEnd(event => {
      const distance =
        Math.sqrt(
          Math.pow(translateX.value, 2) + Math.pow(translateY.value, 2),
        ) -
        SIZE / 2;
      if (distance < RADIUS) {
        translateX.value = withSpring(0, { stiffness: 300, damping: 30 });
        translateY.value = withSpring(0, { stiffness: 300, damping: 30 });
      }
    });

  return (
    <View style={styles.container}>
      <View style={styles.circularView}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.box, animatedStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
};

export default Animation2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
  },
  box: {
    width: SIZE,
    height: SIZE,
    backgroundColor: '#00A877', // Peacock Green
    borderRadius: 20,
  },
  circularView: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: '100%',
    borderWidth: 5,
    borderColor: '#7851A9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
