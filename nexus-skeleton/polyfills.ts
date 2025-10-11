import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';
import { decode, encode } from 'base-64';

// Polyfill Buffer globally
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer as any;
}

// Polyfill Base64 for PDF-lib and XLSX
if (typeof global.atob === 'undefined') {
  global.atob = decode;
}

if (typeof global.btoa === 'undefined') {
  global.btoa = encode;
}

export {}; // Make this a module

