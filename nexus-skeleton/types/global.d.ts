/// <reference types="expo-router" />

declare global {
  namespace NodeJS {
    interface Global {
      Buffer: typeof Buffer;
    }
  }
  var Buffer: typeof Buffer;
}

export {};

