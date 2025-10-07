import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';

// Polyfill Buffer globally
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer as any;
}

export {}; // Make this a module

