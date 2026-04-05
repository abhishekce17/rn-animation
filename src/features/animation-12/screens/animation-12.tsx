import { Pressable, StyleSheet, Text, View } from 'react-native';
import { memo } from 'react';
import {
  About,
  ArrowRight,
  Blog,
  Careers,
  ChevronRight,
  Contact,
  Projects,
  SquareMenu,
} from '../../../assets/svg';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedProps,
  withTiming, // 1. Added to fix the ghost clicks
} from 'react-native-reanimated';

type headerType = {
  option: string;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
};

const OPTIONHEIGHT = 64;

const HEADER: headerType[] = [
  {
    option: 'Header',
    leftIcon: <SquareMenu width={30} height={30} />,
    rightIcon: <ChevronRight color="#fff" />,
  },
  {
    option: 'About',
    leftIcon: <About width={30} height={30} />,
    rightIcon: <ArrowRight width={20} height={20} color="#fff" />,
  },
  {
    option: 'Projects',
    leftIcon: <Projects width={30} height={30} />,
    rightIcon: <ArrowRight width={20} height={20} color="#fff" />,
  },
  {
    option: 'Contact',
    leftIcon: <Contact width={30} height={30} />,
    rightIcon: <ArrowRight width={20} height={20} color="#fff" />,
  },
  {
    option: 'Blog',
    leftIcon: <Blog width={30} height={30} />,
    rightIcon: <ArrowRight width={20} height={20} color="#fff" />,
  },
  {
    option: 'Careers',
    leftIcon: <Careers width={30} height={30} />,
    rightIcon: <ArrowRight width={20} height={20} color="#fff" />,
  },
];

type EachOptionType = headerType & {
  isHeader: boolean;
  handleHeaderPress: () => void;
  progress: SharedValue<number>;
  index: number;
};

const _EachOption = ({
  option,
  leftIcon,
  rightIcon,
  isHeader,
  handleHeaderPress,
  progress,
  index,
}: EachOptionType) => {
  // YOUR ORIGINAL MATH
  const collapsedOffsetY = -(index * OPTIONHEIGHT * 1.4);
  const collapsedScale = Math.max(0.5, 1 - index * 0.08);
  const collapsedShade = Math.min(96, 35 + index * 12);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = progress.value * 90;
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const optionsStyle = useAnimatedStyle(() => {
    const bgcolor = interpolateColor(
      progress.value,
      [0, 1],
      [`rgb(${collapsedShade}, ${collapsedShade}, ${collapsedShade})`, 'rgb(35, 35, 35)'],
    );
    const translateY = interpolate(progress.value, [0, 1], [collapsedOffsetY, 0]);
    const scale = interpolate(progress.value, [0, 1], [collapsedScale, 1]);

    return {
      backgroundColor: bgcolor,
      transform: [{ translateY }, { scale }],
    };
  });

  // THE FIX: Secure touch targets so hidden items cannot be clicked
  const animatedProps = useAnimatedProps(() => {
    return {
      pointerEvents: isHeader || progress.value > 0.5 ? 'auto' : 'none',
    } as any;
  });

  return (
    <Animated.View 
      animatedProps={animatedProps}
      // YOUR ORIGINAL STYLE
      style={[styles.options, isHeader ? styles.headerOption : optionsStyle, { zIndex: HEADER.length - index }]}
    >
      <Pressable
        style={styles.pressableStyle}
        onPress={isHeader ? handleHeaderPress : undefined}
      >
        <View style={styles.iconStyle}>{leftIcon}</View>
        <Text style={[styles.textStyle, isHeader && styles.headerTextStyle]}>
          {option}
        </Text>
        <Animated.View
          style={[styles.rightIconStyle, isHeader && animatedStyle]}
        >
          {rightIcon}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const EachOption = memo(_EachOption);

const Animation12 = () => {
  const progress = useSharedValue(0);
  
  // THE FIX: Rapid-press tracker
  const isOpen = useSharedValue(true);

  const handleHeaderPress = () => {
    isOpen.value = !isOpen.value;
    progress.value = withSpring(isOpen.value ? 1 : 0, { stiffness: 250, damping: 30 });
  };
  
  // YOUR ORIGINAL CENTER-EXPANSION WRAPPER
  const wrapperStyle = useAnimatedStyle(() => {
    return {
        transform : [
            {translateY: withTiming(interpolate(isOpen.value ? 1 : 0, [0, 1], [0, (HEADER.length/2) * OPTIONHEIGHT]))}
        ]
    }
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.listWrapper, wrapperStyle]}>
        {HEADER.map((item, index) => {
          const isHeader = index === 0;

          return (
            <EachOption
              key={index}
              index={index}
              option={item.option}
              leftIcon={item.leftIcon}
              rightIcon={item.rightIcon}
              isHeader={isHeader}
              progress={progress}
              handleHeaderPress={handleHeaderPress}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

// YOUR ORIGINAL STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  listWrapper: {
    width: '86%',
  },
  options: {
    width: '100%',
    minHeight: OPTIONHEIGHT,
    backgroundColor: 'rgb(35, 35, 35)',
    borderRadius: 14,
    marginBottom: 10
  },
  pressableStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerOption: {
    backgroundColor: '#1c1c1c',
    borderColor: '#3a3a3a',
  },
  iconStyle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconStyle: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerTextStyle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

export default Animation12;