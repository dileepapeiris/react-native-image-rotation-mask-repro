import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
});

export default App;
