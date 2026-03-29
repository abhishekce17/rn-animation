import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetworkLogger, { startNetworkLogging } from 'react-native-network-logger';

// Start network logging here so it runs as soon as this component is imported
startNetworkLogging();

export const NetworkLoggerOverlay = () => {
  const [showLogger, setShowLogger] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => setShowLogger(true)}
      >
        <Text style={styles.floatingButtonText}>Net Logs</Text>
      </TouchableOpacity>

      {/* Network Logger Overlay Custom View */}
      {showLogger && (
        <View style={styles.customModalContainer}>
          <SafeAreaProvider style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowLogger(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close Logger</Text>
              </TouchableOpacity>
            </View>
            <NetworkLogger theme="dark" />
          </SafeAreaProvider>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  customModalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1c1c1e',
    zIndex: 10000,
    elevation: 10000,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 9999,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1c1c1e',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
