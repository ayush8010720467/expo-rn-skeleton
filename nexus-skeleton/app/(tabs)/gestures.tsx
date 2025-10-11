import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Trash2, Move, ZoomIn, RefreshCw } from 'lucide-react-native';

export default function GesturesScreen() {
  const [deletedItems, setDeletedItems] = useState<number[]>([]);
  const [itemOrder, setItemOrder] = useState([1, 2, 3, 4, 5]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [gestureLog, setGestureLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setGestureLog((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev].slice(0, 10));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Swipeable Item Component
  const SwipeableItem = ({ id, title }: { id: number; title: string }) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const handleDelete = () => {
      setDeletedItems((prev) => [...prev, id]);
      addLog(`Deleted item: ${title}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    };

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = event.translationX;
      })
      .onEnd((event) => {
        if (event.translationX < -100) {
          // Swipe left to delete
          translateX.value = withTiming(-400);
          opacity.value = withTiming(0, {}, () => {
            runOnJS(handleDelete)();
          });
        } else {
          translateX.value = withSpring(0);
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    }));

    if (deletedItems.includes(id)) {
      return null;
    }

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.swipeableItem, animatedStyle]}>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemHint}>← Swipe left to delete</Text>
          </View>
          <View style={styles.deleteArea}>
            <Trash2 color="#FFFFFF" size={24} />
          </View>
        </Animated.View>
      </GestureDetector>
    );
  };

  // Pinch to Zoom Component
  const PinchToZoomBox = () => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinchGesture = Gesture.Pinch()
      .onUpdate((event) => {
        scale.value = savedScale.value * event.scale;
      })
      .onEnd(() => {
        savedScale.value = scale.value;
        runOnJS(addLog)(`Pinch: Scale = ${scale.value.toFixed(2)}`);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: Math.max(0.5, Math.min(scale.value, 3)) }],
    }));

    return (
      <View style={styles.pinchContainer}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.View style={[styles.pinchBox, animatedStyle]}>
            <ZoomIn color="#FFFFFF" size={32} />
            <Text style={styles.pinchText}>Pinch to Zoom</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  };

  // Pan Gesture Tracker
  const PanTracker = () => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      })
      .onEnd((event) => {
        runOnJS(setPosition)({
          x: Math.round(event.translationX),
          y: Math.round(event.translationY),
        });
        runOnJS(addLog)(`Pan: (${Math.round(event.translationX)}, ${Math.round(event.translationY)})`);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    return (
      <View style={styles.panContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.panBox, animatedStyle]}>
            <Move color="#FFFFFF" size={24} />
            <Text style={styles.panText}>Drag Me</Text>
          </Animated.View>
        </GestureDetector>
        <Text style={styles.positionText}>
          Position: ({position.x}, {position.y})
        </Text>
      </View>
    );
  };

  // Long Press Component
  const LongPressBox = () => {
    const scale = useSharedValue(1);

    const handleLongPress = () => {
      addLog('Long press detected!');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      Alert.alert('Long Press', 'You performed a long press!');
    };

    const longPressGesture = Gesture.LongPress()
      .minDuration(500)
      .onStart(() => {
        scale.value = withSpring(0.9);
      })
      .onEnd(() => {
        scale.value = withSpring(1);
        runOnJS(handleLongPress)();
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <GestureDetector gesture={longPressGesture}>
        <Animated.View style={[styles.longPressBox, animatedStyle]}>
          <Text style={styles.longPressText}>Press & Hold</Text>
          <Text style={styles.longPressHint}>(500ms minimum)</Text>
        </Animated.View>
      </GestureDetector>
    );
  };

  // Pull to Refresh Component
  const PullToRefresh = () => {
    const translateY = useSharedValue(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
      setIsRefreshing(true);
      setRefreshCount((prev) => prev + 1);
      addLog('Pull to refresh triggered');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    };

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        if (event.translationY > 0) {
          translateY.value = event.translationY;
        }
      })
      .onEnd((event) => {
        if (event.translationY > 100 && !isRefreshing) {
          runOnJS(handleRefresh)();
        }
        translateY.value = withTiming(0);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const refreshIndicatorStyle = useAnimatedStyle(() => ({
      opacity: Math.min(translateY.value / 100, 1),
      transform: [{ rotate: `${translateY.value * 3}deg` }],
    }));

    return (
      <View style={styles.refreshContainer}>
        <Animated.View style={[styles.refreshIndicator, refreshIndicatorStyle]}>
          <RefreshCw color="#007AFF" size={24} />
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.refreshBox, animatedStyle]}>
            <Text style={styles.refreshText}>
              {isRefreshing ? '↻ Refreshing...' : '↓ Pull down to refresh'}
            </Text>
            <Text style={styles.refreshCount}>Refreshed: {refreshCount} times</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  };

  // Tap Counter
  const TapCounter = () => {
    const [tapCount, setTapCount] = useState(0);
    const scale = useSharedValue(1);

    const handleTap = () => {
      setTapCount((prev) => prev + 1);
      addLog(`Tap detected (total: ${tapCount + 1})`);
    };

    const tapGesture = Gesture.Tap()
      .numberOfTaps(1)
      .onStart(() => {
        scale.value = withSequence(withSpring(0.9), withSpring(1));
        runOnJS(handleTap)();
      });

    const doubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(() => {
        runOnJS(addLog)('Double tap detected!');
        scale.value = withSequence(withSpring(1.2), withSpring(1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      });

    const composed = Gesture.Exclusive(doubleTapGesture, tapGesture);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.tapBox, animatedStyle]}>
          <Text style={styles.tapText}>Tap Me!</Text>
          <Text style={styles.tapCount}>{tapCount} taps</Text>
          <Text style={styles.tapHint}>Try double-tap too!</Text>
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>👋 Gesture Handler Tests</Text>
      <Text style={styles.subtitle}>Interactive gesture demonstrations</Text>

      {/* Gesture Log */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Gesture Log</Text>
        {gestureLog.length === 0 ? (
          <Text style={styles.logEmpty}>Perform gestures to see logs here</Text>
        ) : (
          gestureLog.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))
        )}
      </View>

      {/* Swipe to Delete */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1️⃣ Swipe to Delete</Text>
        <Text style={styles.description}>Swipe items left to remove them</Text>
        <SwipeableItem id={1} title="Swipe me left to delete" />
        <SwipeableItem id={2} title="I can be deleted too" />
        <SwipeableItem id={3} title="Try swiping this one" />
      </View>

      {/* Pinch to Zoom */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>2️⃣ Pinch to Zoom</Text>
        <Text style={styles.description}>Use two fingers to zoom in/out</Text>
        <PinchToZoomBox />
      </View>

      {/* Pan Gesture */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>3️⃣ Pan Gesture Tracker</Text>
        <Text style={styles.description}>Drag the box around to track movement</Text>
        <PanTracker />
      </View>

      {/* Long Press */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>4️⃣ Long Press</Text>
        <Text style={styles.description}>Press and hold for 500ms</Text>
        <LongPressBox />
      </View>

      {/* Pull to Refresh */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>5️⃣ Pull to Refresh</Text>
        <Text style={styles.description}>Pull down on the box to trigger refresh</Text>
        <PullToRefresh />
      </View>

      {/* Tap Gestures */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>6️⃣ Tap & Double Tap</Text>
        <Text style={styles.description}>Single tap to count, double tap for special effect</Text>
        <TapCounter />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  // Gesture Log
  logEmpty: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  logText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // Swipeable Item
  swipeableItem: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  itemContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemHint: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  deleteArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Pinch to Zoom
  pinchContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  pinchBox: {
    width: 120,
    height: 120,
    backgroundColor: '#34C759',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinchText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  // Pan Tracker
  panContainer: {
    height: 200,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panBox: {
    width: 100,
    height: 100,
    backgroundColor: '#FF9500',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  positionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontFamily: 'monospace',
  },
  // Long Press
  longPressBox: {
    backgroundColor: '#5856D6',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  longPressText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  longPressHint: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  // Pull to Refresh
  refreshContainer: {
    position: 'relative',
  },
  refreshIndicator: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -12,
    zIndex: 1,
  },
  refreshBox: {
    backgroundColor: '#F9F9F9',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  refreshCount: {
    fontSize: 14,
    color: '#666',
  },
  // Tap Counter
  tapBox: {
    backgroundColor: '#FF2D55',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  tapText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tapCount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tapHint: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
});



