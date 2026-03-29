import { StyleSheet, View } from 'react-native';
import Box from '../components/Box';
import { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

const Animation10 = () => {
  const progess = useSharedValue(0);
  useEffect(()=>{
    progess.value = withRepeat(withTiming(4* Math.PI, { duration: 5000, easing: Easing.linear }), -1);
  }, []);

  return (
    <View style={styles.container}>
      {[...Array(12)].map((_, i) => (
        <Box key={i} index={i} progress={progess} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default Animation10;
