import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { PressableButton } from '../../../components';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { Canvas, Group, Skia, Skottie } from '@shopify/react-native-skia';
import TrashLottieJson from '../../../assets/lottie/trash.json';
const animation = Skia.Skottie.Make(JSON.stringify(TrashLottieJson));

const _EachText = ({
  text,
  id,
  onSwipe,
}: {
  text: string;
  id: string;
  onSwipe: (id: string) => void;
}) => {
  const [isSwipingOrDeleting, setIsSwipingOrDeleting] = useState(false);
  const translateX = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .failOffsetY([-5, 5])
    .activeOffsetX([-5, 5])
    .onBegin(() => {
      // 2. The millisecond they touch the row, mount the Canvas.
      // `runOnJS` is required because Gesture handler runs on the UI thread
      if (!isSwipingOrDeleting) {
        scheduleOnRN(setIsSwipingOrDeleting, true);
      }
    })
    .onChange(event => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onFinalize(event => {
      if (event.translationX < -100) {
        // Case 1: DELETE (Keep Skia until removed from DOM)
        translateX.value = withTiming(-500, { duration: 300 }, () => {
          scheduleOnRN(onSwipe, id);
        });
      } else {
        // Case 2: RESET (Wait for spring to finish before unmounting Skia)
        translateX.value = withSpring(0, { damping: 80 }, finished => {
          if (finished) {
            scheduleOnRN(setIsSwipingOrDeleting, false);
          }
        });
      }
    });

  const derivedFrame = useDerivedValue(() => {
    return interpolate(
      Math.abs(translateX.value),
      [100, 500],
      [0, 91],
      'clamp',
    );
  });

  const derivedOpacity = useDerivedValue(() => {
    return interpolate(Math.abs(translateX.value), [0, 350], [0, 1], 'clamp');
  });

  const lottieStyle = useAnimatedStyle(() => ({
    opacity: derivedOpacity.value,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  return (
    <Animated.View
      style={styles.itemWrapper}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Animated.View style={[styles.lottieContainer, lottieStyle]}>
        {isSwipingOrDeleting && (
          <Canvas style={styles.lottieCanvas}>
            <Group transform={[{ scale: 0.13 }]}>
              <Skottie animation={animation} frame={derivedFrame} />
            </Group>
          </Canvas>
        )}
      </Animated.View>
      <Animated.View style={[{ width: '100%' }, animatedStyle]}>
        <GestureDetector gesture={panGesture}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.testStyle}>
            {text}
          </Text>
        </GestureDetector>
      </Animated.View>
    </Animated.View>
  );
};

const _BottomInputBar = ({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) => {
  // We safely use state here because re-rendering this tiny box costs 0ms
  const [inputText, setInputText] = useState('');

  const handleLocalSubmit = () => {
    const cleanText = inputText.trim();
    if (!cleanText) return;

    onSubmit(cleanText); // Send data up
    setInputText(''); // Declaratively clear the screen!
  };

  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Enter text..."
        value={inputText} // Controlled component
        onChangeText={setInputText}
        placeholderTextColor={'gray'}
      />
      <PressableButton
        buttonStyle={styles.buttonStyle}
        btnTextStyle={styles.btnTextStyle}
        title="Submit"
        onPress={handleLocalSubmit}
      />
    </View>
  );
};

const EachText = memo(_EachText);
const BottomInputBar = memo(_BottomInputBar);
const Animation8 = () => {
  const [someTextArrays, setSomeTextArrays] = useState<
    { id: string; text: string }[]
  >([
    {
      id: '1',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: '2',
      text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ]);

  const handleOnSubmit = useCallback((text: string) => {
    setSomeTextArrays(prev => [...prev, { id: Date.now().toString(), text }]);
  }, []);

  const handleRemoveText = useCallback((id: string) => {
    setSomeTextArrays(prev => prev.filter(item => item.id !== id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: { id: string; text: string } }) => {
      return (
        <EachText text={item.text} id={item.id} onSwipe={handleRemoveText} />
      );
    },
    [handleRemoveText],
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        contentContainerStyle={styles.flatlistContentContainer}
        data={someTextArrays}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
      <BottomInputBar onSubmit={handleOnSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: '#fffce8',
    paddingBottom: 50,
  },
  flatlistContentContainer: {
    width: '100%',
    padding: 15,
    gap: 10,
  },
  testStyle: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    fontSize: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  textInput: {
    width: '72%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    fontSize: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  buttonStyle: {
    backgroundColor: '#faffd7', // The opaque surface
    padding: 15,
    width: '25%',
    borderRadius: 5, // The rounded geometry
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  btnTextStyle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#000',
  },
  lottieContainer: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
  },
  itemWrapper: {
    width: '100%',
  },
  lottieCanvas: { ...StyleSheet.absoluteFill },
});

export default Animation8;
