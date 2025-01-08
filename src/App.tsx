import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Navig from './screen/Navig';

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup the subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = () => {
    // Manually recheck the connection
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  };

  return (
    <>
      {isConnected === false ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>No internet connection detected!</Text>
          <Button title="Retry" onPress={handleRetry} color="#007bff" />
        </View>
      ) : (
        <Navig />
      )}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 16,
  },
});
