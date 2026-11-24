import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.items}>
        {[0, 1, 2].map(index => (
          <View key={index} style={styles.item}>
            {children}
          </View>
        ))}
      </View>
    </View>
  );
}

function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  row: { marginBottom: 16 },
  title: { color: 'white', fontSize: 18, marginHorizontal: 16, marginBottom: 8 },
  items: { flexDirection: 'row', marginHorizontal: 16, gap: 8 },
  item: { flex: 1, height: 90, backgroundColor: 'green', overflow: 'hidden' },
});

export default App;
