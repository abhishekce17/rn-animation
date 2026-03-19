import { View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { RenderWords } from '../components/render-words';

const WORDS = ['Hello', 'World', 'React', 'Native', 'Animation', 'Reanimated'];

const Animation3 = () => {
  const translateX = useSharedValue(0);
  const scrollbarHandler = useAnimatedScrollHandler({
    onScroll: event => {
      translateX.value = event.contentOffset.x;
    },
  });
  return (
    <Animated.ScrollView
      horizontal
      //   pagingEnabled
      onScroll={scrollbarHandler}
      scrollEventThrottle={16}
    >
      {WORDS.map((word, index) => (
        <RenderWords
          key={word}
          word={word}
          index={index}
          translateX={translateX}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default Animation3;
