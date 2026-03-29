import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigation } from './src/navigation/RootNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GlobalSafeAreaView, NetworkLoggerOverlay } from './src/components';
import { HotUpdater } from "@hot-updater/react-native";

function App() {
  const theme = useColorScheme();
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GlobalSafeAreaView unsafeBottom barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} >
          <RootNavigation />
        </GlobalSafeAreaView>
        <NetworkLoggerOverlay />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

// export default App;

export default HotUpdater.wrap({
  baseURL: "https://dikawdkmpyyurfhfzrkw.supabase.co/functions/v1/ota-update-server",  
  updateStrategy: "appVersion", // or "fingerprint"
  updateMode: "auto",
})(App);
