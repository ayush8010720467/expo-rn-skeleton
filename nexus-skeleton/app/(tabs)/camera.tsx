import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image as RNImage, ScrollView } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, PhotoFile } from 'react-native-vision-camera';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { Camera as CameraIcon, SwitchCamera, Zap, ZapOff, Image as ImageIcon, Share2, Trash2 } from 'lucide-react-native';

export default function CameraScreen() {
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [capturedPhotos, setCapturedPhotos] = useState<PhotoFile[]>([]);
  const [isActive, setIsActive] = useState(true);

  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(cameraPosition);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    try {
      if (!camera.current) {
        Alert.alert('Error', 'Camera not ready');
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      const photo = await camera.current.takePhoto({
        flash: flash,
        qualityPrioritization: 'quality',
      });

      setCapturedPhotos((prev) => [photo, ...prev]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      Alert.alert('Success', `Photo captured!\nPath: ${photo.path.split('/').pop()}`);
    } catch (error) {
      console.error('Failed to take photo:', error);
      Alert.alert('Error', `Failed to capture photo: ${error}`);
    }
  };

  const switchCamera = () => {
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const toggleFlash = () => {
    const flashModes: Array<'off' | 'on' | 'auto'> = ['off', 'on', 'auto'];
    const currentIndex = flashModes.indexOf(flash);
    const nextIndex = (currentIndex + 1) % flashModes.length;
    setFlash(flashModes[nextIndex]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const sharePhoto = async (photo: PhotoFile) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(`file://${photo.path}`, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share Photo',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to share photo: ${error}`);
    }
  };

  const deletePhoto = (photo: PhotoFile) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(`file://${photo.path}`, { idempotent: true });
            setCapturedPhotos((prev) => prev.filter((p) => p.path !== photo.path));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          } catch (error) {
            Alert.alert('Error', `Failed to delete photo: ${error}`);
          }
        },
      },
    ]);
  };

  const getPhotoInfo = async (photo: PhotoFile) => {
    try {
      const info = await FileSystem.getInfoAsync(`file://${photo.path}`);
      const sizeKB = info.size ? Math.round(info.size / 1024) : 'Unknown';
      Alert.alert(
        'Photo Info',
        `Path: ${photo.path.split('/').pop()}\n` +
        `Size: ${sizeKB} KB\n` +
        `Width: ${photo.width}px\n` +
        `Height: ${photo.height}px\n` +
        `Orientation: ${photo.orientation}`
      );
    } catch (error) {
      Alert.alert('Error', `Failed to get photo info: ${error}`);
    }
  };

  const clearAllPhotos = () => {
    Alert.alert('Clear All Photos', 'Delete all captured photos?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          for (const photo of capturedPhotos) {
            try {
              await FileSystem.deleteAsync(`file://${photo.path}`, { idempotent: true });
            } catch (error) {
              console.error('Failed to delete:', error);
            }
          }
          setCapturedPhotos([]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        },
      },
    ]);
  };

  // Permission not granted
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <CameraIcon color="#FF3B30" size={64} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            This app needs camera access to take photos. Please grant permission to continue.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // No camera device
  if (!device) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <CameraIcon color="#FF9500" size={64} />
          <Text style={styles.permissionTitle}>No Camera Found</Text>
          <Text style={styles.permissionText}>
            No camera device available. This feature requires a physical device with a camera.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          photo={true}
        />

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            {flash === 'off' ? (
              <ZapOff color="#FFFFFF" size={24} />
            ) : (
              <Zap color={flash === 'on' ? '#FFCC00' : '#FFFFFF'} size={24} />
            )}
            <Text style={styles.controlText}>{flash.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.thumbnailButton} onPress={clearAllPhotos}>
            {capturedPhotos.length > 0 ? (
              <View>
                <RNImage
                  source={{ uri: `file://${capturedPhotos[0].path}` }}
                  style={styles.thumbnail}
                />
                <View style={styles.photoCount}>
                  <Text style={styles.photoCountText}>{capturedPhotos.length}</Text>
                </View>
              </View>
            ) : (
              <ImageIcon color="#FFFFFF" size={32} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={switchCamera}>
            <SwitchCamera color="#FFFFFF" size={32} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Photo Gallery */}
      {capturedPhotos.length > 0 && (
        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>
              📸 Captured Photos ({capturedPhotos.length})
            </Text>
            <TouchableOpacity onPress={clearAllPhotos}>
              <Trash2 color="#FF3B30" size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            {capturedPhotos.map((photo, index) => (
              <View key={photo.path} style={styles.photoCard}>
                <RNImage source={{ uri: `file://${photo.path}` }} style={styles.photoImage} />
                <View style={styles.photoActions}>
                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={() => getPhotoInfo(photo)}
                  >
                    <Text style={styles.photoActionText}>ℹ️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={() => sharePhoto(photo)}
                  >
                    <Share2 color="#007AFF" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={() => deletePhoto(photo)}
                  >
                    <Trash2 color="#FF3B30" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F5F5F7',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  topControls: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  thumbnailButton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  photoCount: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
  },
  switchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    maxHeight: 200,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  gallery: {
    paddingHorizontal: 16,
  },
  photoCard: {
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    overflow: 'hidden',
  },
  photoImage: {
    width: 120,
    height: 120,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  photoActionButton: {
    padding: 4,
  },
  photoActionText: {
    fontSize: 16,
  },
});



