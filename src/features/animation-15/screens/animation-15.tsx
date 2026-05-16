import React, { memo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { CardProps, Cards } from '../components/Cards';
import { Canvas, RadialGradient, Rect } from '@shopify/react-native-skia';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const data: CardProps[] = [
  {
    imgSrc: require('../assets/images/stack-1.jpg'),
    title: 'Porsche GT3 RS',
    subTitle:
      'The Porsche GT3 RS stands as a testament to precision engineering and raw track performance.',
    icon: require('../assets/logos/porsche.png'),
  },
  {
    imgSrc: require('../assets/images/stack-2.jpg'),
    title: 'Koenigsegg Jesko',
    subTitle:
      'The Koenigsegg Jesko redefined the boundaries of speed and innovation with its groundbreaking light-speed transmission.',
    icon: require('../assets/logos/koenigsegg.png'),
  },
  {
    imgSrc: require('../assets/images/stack-3.jpg'),
    title: 'Ferrari F40 Liberty Walk',
    subTitle:
      'The legendary Ferrari F40 is transformed into a wide-body masterpiece by the artisans at Liberty Walk.',
    icon: require('../assets/logos/ferrari.png'),
  },
  {
    imgSrc: require('../assets/images/stack-4.jpg'),
    title: 'Mustang Shelby GT500',
    subTitle:
      'The Ford Mustang Shelby GT500 is the ultimate expression of American muscle, packing a supercharged punch under its hood.',
    icon: require('../assets/logos/mustang.png'),
  },
];

const CardItem = memo(
  ({
    item,
    idx,
    progress,
    length,
  }: {
    item: CardProps;
    idx: number;
    progress: SharedValue<number>;
    length: number;
  }) => {
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(idx * -10);

    // Simplified infinite wrapping formula
    const index = useDerivedValue(() => {
      const val = idx - progress.value;
      const max = length - 1;
      return max - ((((max - val) % length) + length) % length);
    });

    const zIndex = useDerivedValue(() => {
      return Math.round(length - index.value);
    });

    // Consolidated state reaction for rotation and stack return
    useAnimatedReaction(
      () => ({ i: index.value, y: translateY.value }),
      (current, prev) => {
        // 1. Handle rotation (straight at bottom, tilted in stack)
        if (current.y > 100) {
          rotate.value = withSpring(0, { overshootClamping: true });
        } else {
          rotate.value = withSpring(-current.i * 10, {
            overshootClamping: true,
          });
        }

        // 2. Handle stack return (triggered when the next card is swiped)
        if (prev && prev.i > 2.9 && current.i < 2.9 && current.y > 100) {
          translateY.value = withSpring(0, {
            duration: 600,
            overshootClamping: true,
          });
        }
      },
    );

    const gesture = Gesture.Pan()
      .onChange(v => {
        if (translateY.value + v.changeY > 0 && Math.abs(index.value) < 0.1) {
          translateY.value += v.changeY;
        }
      })
      .onFinalize(() => {
        if (Math.abs(index.value) < 0.1) {
          if (translateY.value > 200) {
            translateY.value = withSpring(windowHeight * 0.6, {
              duration: 600,
              overshootClamping: true,
            });
            progress.value = withSpring(progress.value + 1, {
              duration: 600,
              overshootClamping: true,
            });
          } else {
            translateY.value = withSpring(0, {
              duration: 600,
              overshootClamping: true,
            });
          }
        }
      });

    const rStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        translateY.value,
        [0, windowHeight * 0.6],
        [1, 0.9],
        'clamp',
      );

      return {
        transform: [
          { translateY: translateY.value },
          { rotate: `${rotate.value}deg` },
          { scale },
        ],
        zIndex: zIndex.value,
      };
    });

    const tintStyle = useAnimatedStyle(() => {
      const alpha = interpolate(
        index.value,
        [0, 1, length - 1],
        [0, 0.2, 0.4],
        'clamp',
      );
      return {
        backgroundColor: `rgba(255, 255, 255, ${alpha})`,
      };
    });

    const zIndexStyle = useAnimatedStyle(() => {
      return {
        zIndex: zIndex.value,
      };
    });

    return (
      <Animated.View style={[styles.cardContainer, zIndexStyle]}>
        <Animated.View style={rStyle}>
          <GestureDetector gesture={gesture}>
            <View style={styles.cardWrapper}>
              <Cards {...item} />
              <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, styles.overlayTint, tintStyle]}
              />
            </View>
          </GestureDetector>
        </Animated.View>
      </Animated.View>
    );
  },
);

// ─── Vignette geometry ───────────────────────────────────────────────────────
// Clear window: slightly larger than the card (320 × 450)
const CLEAR_W = 340;
const CLEAR_H = 470;
const clearLeft = (windowWidth - CLEAR_W) / 2;
const clearTop = (windowHeight - CLEAR_H) / 2;
const clearBottom = clearTop + CLEAR_H;

/**
 * Four native BlurView strips that frame the screen around the center clear
 * area. BlurView operates at the native compositor level so it blurs *all*
 * layers behind it — both Skia Canvas and React Native views.
 */

const Animation15 = () => {
  const progress = useSharedValue(0);

  return (
    <View style={styles.constainer}>
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} height={windowHeight} width={windowWidth}>
          <RadialGradient
            c={{ x: windowWidth / 2, y: windowHeight / 2.2 }}
            r={windowWidth / 1.2}
            colors={['#809fb1ff', '#cca8c7ff']}
          />
        </Rect>
      </Canvas>
      {data.map((item, index) => (
        <CardItem
          key={index}
          item={item}
          idx={index}
          length={data.length}
          progress={progress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: 320,
    height: 450,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -99,
  },
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  // Vignette strips — each covers one edge band, leaving the center clear
  vignetteTop: {
    bottom: undefined,
    height: clearTop,
  },
  vignetteBottom: {
    top: clearBottom,
  },
  vignetteLeft: {
    top: clearTop,
    right: undefined,
    width: clearLeft,
    height: CLEAR_H,
  },
  vignetteRight: {
    top: clearTop,
    left: undefined,
    width: clearLeft,
    height: CLEAR_H,
  },
});

export default Animation15;
