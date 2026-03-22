import { Pressable, PressableProps, Text, TextStyle } from 'react-native';

export const PressableButton = ({
  title,
  onPress,
  buttonStyle,
  btnTextStyle,
}: {
  title: number | string;
  buttonStyle?: PressableProps['style'];
  btnTextStyle?: TextStyle;
  onPress: (v: number) => void;
}) => (
  <Pressable
    onPress={() => onPress((title as number) / 100)}
    style={buttonStyle}
    android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
  >
    <Text style={btnTextStyle}>{title}</Text>
  </Pressable>
);
