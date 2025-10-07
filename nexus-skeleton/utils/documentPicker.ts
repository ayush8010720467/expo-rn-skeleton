import * as DocumentPicker from 'expo-document-picker';

export async function pickDocument() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.error('Error picking document:', error);
    throw error;
  }
}

export async function pickMultipleDocuments() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!result.canceled) {
      return result.assets;
    }

    return null;
  } catch (error) {
    console.error('Error picking documents:', error);
    throw error;
  }
}

