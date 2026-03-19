import { StyleSheet, Text, View } from 'react-native';
import Heart from '../../../assets/svg/heart.svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { scheduleOnRN } from 'react-native-worklets';

// Define the exact dimensions of your SVG so the engine can calculate the offset
const HEART_SIZE = 200;
const HALF_HEART = HEART_SIZE / 2;
const AnimatedHeart = Animated.createAnimatedComponent(Heart);

const FloatingHeart = ({
  x,
  y,
  id,
  onComplete,
}: {
  x: number;
  y: number;
  id: number;
  onComplete: (id: number) => void;
}) => {
  const scaleSharedValue = useSharedValue(0);
  const transX = useSharedValue(x);
  const transY = useSharedValue(y);
  const hearStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // The order of these matrix operations is critical! Translate FIRST, then scale.
        { translateX: transX.value },
        { translateY: transY.value },
        { scale: Math.max(0, scaleSharedValue.value) },
      ],
    };
  });

  useEffect(() => {
    scaleSharedValue.value = withSequence(
      withSpring(1, { mass: 1, damping: 10, stiffness: 200 }),
      withDelay(
        0,
        withTiming(0, { duration: 150 }, isFinished => {
          if (isFinished) {
            scheduleOnRN(onComplete, id);
          }
        }),
      ),
    );
  }, []);

  return (
    <AnimatedHeart
      style={[styles.heartContainer, hearStyle]}
      width={HEART_SIZE}
      height={HEART_SIZE}
    />
  );
};

const Animation5 = () => {
  const [hearQueue, setHearQueue] = useState<
    { x: number; y: number; id: number }[]
  >([]);

  const tabGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(300)
    .onEnd(event => {
      setHearQueue(prev => [
        ...prev,
        {
          x: event.x - HALF_HEART,
          y: event.y - HALF_HEART,
          id: Date.now() + Math.random(),
        },
      ]);
    })
    .runOnJS(true);

  const removeHeart = (id: number) => {
    setHearQueue(prev => prev.filter(heart => heart.id !== id));
  };

  return (
    <GestureDetector gesture={tabGesture}>
      {/* We add a specific tap zone to catch the gesture accurately */}
      <View style={styles.container}>
        {/* <Animated.View style={[styles.heartContainer, hearStyle]}> */}
        {hearQueue.map(({ x, y, id }) => (
          <FloatingHeart
            key={id}
            x={x}
            y={y}
            id={id}
            onComplete={removeHeart}
          />
        ))}

        {/* </Animated.View> */}
        <Text style={styles.instructions}>Double Tab anywhere to spawn!</Text>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // Removed justifyContent/alignItems center so our 0,0 math works flawlessly
  },
  instructions: {
    height: '100%',
    alignSelf: 'center',
    verticalAlign: 'middle',
  },
  heartContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
});

export default Animation5;
