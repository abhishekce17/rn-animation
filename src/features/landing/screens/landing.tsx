import { View, Text } from 'react-native';
import React from 'react';
import { GlobalSafeAreaView } from '../../../components';
import Animation1 from '../../animation-1/screens/animation-1';
import Animation2 from '../../animation-2/screens/animation-2';
import Animation3 from '../../animation-3/screens/animation-3';
import Animation4 from '../../animation-4/screens/animation-4';
import Animation5 from '../../animation-5/screens/animation-5';

const Landing = () => {
  return (
    <GlobalSafeAreaView>
      <Animation5 />
    </GlobalSafeAreaView>
  );
};

export default Landing;
