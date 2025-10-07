import * as FileSystem from 'expo-file-system';

export const fileSystemUtils = {
  documentDirectory: FileSystem.documentDirectory,
  cacheDirectory: FileSystem.cacheDirectory,

  async readFile(uri: string): Promise<string> {
    return await FileSystem.readAsStringAsync(uri);
  },

  async writeFile(uri: string, content: string): Promise<void> {
    await FileSystem.writeAsStringAsync(uri, content);
  },

  async deleteFile(uri: string): Promise<void> {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  },

  async getFileInfo(uri: string) {
    return await FileSystem.getInfoAsync(uri);
  },

  async downloadFile(url: string, filename: string) {
    const uri = `${FileSystem.documentDirectory}${filename}`;
    const downloadResult = await FileSystem.downloadAsync(url, uri);
    return downloadResult.uri;
  },
};

