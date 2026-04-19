import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  LinearGradient,
  vec,
  Rect,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- 1. Helper Functions ---
const random = (min: number, max: number) => Math.random() * (max - min) + min;

type Particle = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  r: number;
  speed: number;
  amplitudeX: number;
  amplitudeY: number;
  phaseX: number;
  phaseY: number;
};

const createParticles = (
  count: number,
  minRadius: number,
  maxRadius: number,
): Particle[] => {
  return Array.from({ length: count }).map(() => ({
    baseX: random(0, width),
    baseY: random(0, height),
    x: 0,
    y: 0,
    r: random(minRadius, maxRadius),
    speed: random(0.0005, 0.0015),
    amplitudeX: random(20, 80),
    amplitudeY: random(20, 80),
    phaseX: random(0, Math.PI * 2),
    phaseY: random(0, Math.PI * 2),
  }));
};

// --- 2. The Background Animation Component ---
const DreamyBackground = () => {
  const bgParticles = useSharedValue(createParticles(40, 1.5, 3));
  const midParticles = useSharedValue(createParticles(25, 3, 5));
  const fgParticles = useSharedValue(createParticles(15, 5, 9));

  useFrameCallback(frameInfo => {
    if (!frameInfo.timestamp) return;
    const time = frameInfo.timestamp;

    const updateLayer = (particlesList: Particle[]) => {
      'worklet'; // Ensure this runs on the UI thread
      return particlesList.map(p => ({
        ...p,
        x: p.baseX + Math.sin(time * p.speed + p.phaseX) * p.amplitudeX,
        y: p.baseY + Math.cos(time * p.speed + p.phaseY) * p.amplitudeY,
      }));
    };

    bgParticles.value = updateLayer(bgParticles.value);
    midParticles.value = updateLayer(midParticles.value);
    fgParticles.value = updateLayer(fgParticles.value);
  });

  const bgPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    bgParticles.value.forEach(p => path.addCircle(p.x, p.y, p.r));
    return path;
  });

  const midPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    midParticles.value.forEach(p => path.addCircle(p.x, p.y, p.r));
    return path;
  });

  const fgPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    fgParticles.value.forEach(p => path.addCircle(p.x, p.y, p.r));
    return path;
  });

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={['#fdfbfb', '#ebedee']} // Soft off-white gradient
        />
      </Rect>
      {/* Particle colors adjusted to match the video's dark/grey theme */}
      <Path path={bgPath} color="rgba(0, 0, 0, 0.1)" />
      <Path path={midPath} color="rgba(0, 0, 0, 0.25)" />
      <Path path={fgPath} color="rgba(0, 0, 0, 0.6)" />
    </Canvas>
  );
};

// --- 3. The Main App Component ---
export default function Animation13() {
  return (
    <View style={styles.container}>
      {/* 1. The Skia Background */}
      <DreamyBackground />
    </View>
  );
}

// --- 4. Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
    zIndex: 1, // Ensures UI is above the Skia Canvas
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50, // Slight visual adjustment
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
