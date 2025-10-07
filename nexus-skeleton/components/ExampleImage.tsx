import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export function ExampleImage() {
  return (
    <Image
      style={styles.image}
      source="https://picsum.photos/seed/696/3000/2000"
      placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      contentFit="cover"
      transition={1000}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
});

