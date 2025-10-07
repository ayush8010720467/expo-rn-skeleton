import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet } from 'react-native';

interface Item {
  id: string;
  title: string;
}

const DATA: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i}`,
  title: `Item ${i + 1}`,
}));

export function ExampleList() {
  return (
    <FlashList
      data={DATA}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      )}
      estimatedItemSize={50}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
  },
});

