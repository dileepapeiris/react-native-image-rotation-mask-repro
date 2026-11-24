import React from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';

const source = require('./assets/test-pattern.png');

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
      <Row title="Image, resizeMode cover">
        <Image source={source} resizeMode="cover" style={styles.fill} />
      </Row>
      <Row title="View (control)">
        <View style={[styles.fill, styles.plain]} />
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  row: { marginBottom: 16 },
  title: { color: 'white', fontSize: 18, marginHorizontal: 16, marginBottom: 8 },
  items: { flexDirection: 'row', marginHorizontal: 16, gap: 8 },
  item: { flex: 1, height: 90, backgroundColor: 'green', overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  plain: { backgroundColor: 'magenta' },
});

export default App;
