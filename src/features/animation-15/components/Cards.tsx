import { Blur, Canvas, RadialGradient, Rect } from '@shopify/react-native-skia';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface CardProps {
  imgSrc: ImageSourcePropType;
  icon: ImageSourcePropType;
  title: string;
  subTitle: string;
}

const CARD_WIDTH = 320;
const CARD_HEIGHT = 450;

export const Cards = ({ imgSrc, icon, title, subTitle }: CardProps) => {
  return (
    <View style={styles.card}>
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} height={CARD_HEIGHT} width={CARD_WIDTH}>
          <RadialGradient
            c={{ x: CARD_WIDTH / 2, y: CARD_HEIGHT / 2 }}
            r={CARD_WIDTH / 2}
            colors={['violet', 'black']}
          />
          <Blur blur={70} />
        </Rect>
      </Canvas>
      <Image source={icon} style={styles.logo} resizeMode="contain" />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Image style={styles.carImg} source={imgSrc} />
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    // borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#3f3f3fff',
    padding: 5,
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    color: '#ebddeeff',
    fontSize: 30,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  subTitle: {
    color: '#D1D5DB',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  carImg: {
    width: 310,
    height: 250,
    alignSelf: 'center',
    marginVertical: 5,
    borderRadius: 10,
  },
});
