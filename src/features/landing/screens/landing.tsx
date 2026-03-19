import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import React from 'react';
// Assuming GlobalSafeAreaView and SCREENS are imported correctly
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SCREENS } from '../../../constants/screens';

const { LANDING, ...animationScreens } = SCREENS;
const animationScreenNames = Object.values(animationScreens);

// 1. Convert the item into a TRUE React Component (Capitalized)
const ScreenListItem = ({ item }: { item: string }) => {
  // This hook is now 100% safe because it lives inside a real component lifecycle.
  const navigation = useNavigation<NavigationProp<any>>();

  const onClickNavigate = () => {
    navigation.navigate(item);
  };

  return (
    <Pressable
      onPress={onClickNavigate}
      style={({ pressed }) => [
        styles.itemButton,
        pressed && styles.itemButtonPressed, // Free performance native feedback!
      ]}
    >
      <Text style={styles.itemText}>{item}</Text>
    </Pressable>
  );
};

const renderScreenItem = ({ item }: { item: string }) => {
  return <ScreenListItem item={item} />;
};

const Landing = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={animationScreenNames}
        renderItem={renderScreenItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 20,
    gap: 10, // Modern gap property replaces messy margins
  },
  itemButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemButtonPressed: {
    opacity: 0.7,
    backgroundColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default Landing;
