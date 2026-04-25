import {
  Blur,
  Canvas,
  Group,
  RadialGradient,
  Rect,
} from '@shopify/react-native-skia';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GroupedCard } from '../components/GroupedCard';
import { useSharedValue, withTiming } from 'react-native-reanimated';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
const CARD_WIDTH = 300;
const CARD_HEIGHT = 200;

const Animation14 = () => {
  const progess = useSharedValue(0);
  const handleOnEnter = () => {
    progess.value = withTiming(1, { duration: 1200 });
  };
  const handleOnLeave = () => {
    progess.value = withTiming(0, { duration: 1200 });
  };
  return (
    <View
      style={styles.container}
      onTouchStart={handleOnEnter}
      onTouchEnd={handleOnLeave}
    >
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} height={windowHeight} width={windowWidth}>
          <RadialGradient
            c={{ x: windowWidth / 2, y: windowHeight / 2.2 }}
            r={windowWidth / 2}
            colors={['violet', 'black']}
          />
          <Blur blur={80} />
        </Rect>
        <Group
          transform={[
            {
              translateX: windowWidth / 2 - CARD_WIDTH / 2,
            },
            {
              translateY: windowHeight / 2 - CARD_HEIGHT / 2,
            },
          ]}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <GroupedCard key={index} index={index} CARD_WIDTH={CARD_WIDTH} CARD_HEIGHT={CARD_HEIGHT} progress={progess} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  canvas: {
    flex: 1,
  },
});

export default Animation14;
