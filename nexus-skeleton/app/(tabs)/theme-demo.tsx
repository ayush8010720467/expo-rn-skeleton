import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { createTheme, createBox, createText, ThemeProvider, useTheme } from '@shopify/restyle';
import { Moon, Sun, Palette, Type, Box as BoxIcon, Layout } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Define Theme
const palette = {
  // Light colors
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F5F5F7',
  gray: '#8E8E93',
  darkGray: '#1C1C1E',

  // Brand colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  secondary: '#5856D6',
  secondaryDark: '#3634A3',

  // Status colors
  success: '#34C759',
  successDark: '#248A3D',
  warning: '#FF9500',
  warningDark: '#C76F00',
  error: '#FF3B30',
  errorDark: '#C72C24',
  info: '#5AC8FA',
  infoDark: '#0A84FF',
};

const lightTheme = createTheme({
  colors: {
    mainBackground: palette.white,
    cardBackground: palette.white,
    text: palette.darkGray,
    textSecondary: palette.gray,
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    border: '#E5E5EA',
    shadow: palette.black,
    white: palette.white,
    black: palette.black,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    round: 999,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'text',
    },
    subheader: {
      fontSize: 20,
      fontWeight: '600',
      color: 'text',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: 'text',
    },
    caption: {
      fontSize: 14,
      color: 'textSecondary',
    },
    small: {
      fontSize: 12,
      color: 'textSecondary',
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'cardBackground',
      borderRadius: 'l',
      padding: 'm',
      shadowColor: 'shadow',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    elevated: {
      backgroundColor: 'cardBackground',
      borderRadius: 'l',
      padding: 'l',
      shadowColor: 'shadow',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    outlined: {
      backgroundColor: 'cardBackground',
      borderRadius: 'l',
      padding: 'm',
      borderWidth: 2,
      borderColor: 'border',
    },
  },
  buttonVariants: {
    primary: {
      backgroundColor: 'primary',
      paddingHorizontal: 'l',
      paddingVertical: 'm',
      borderRadius: 'm',
    },
    secondary: {
      backgroundColor: 'secondary',
      paddingHorizontal: 'l',
      paddingVertical: 'm',
      borderRadius: 'm',
    },
    outline: {
      backgroundColor: 'mainBackground',
      borderWidth: 2,
      borderColor: 'primary',
      paddingHorizontal: 'l',
      paddingVertical: 'm',
      borderRadius: 'm',
    },
  },
});

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    mainBackground: '#000000',
    cardBackground: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    primary: palette.infoDark,
    secondary: palette.secondaryDark,
    success: palette.successDark,
    warning: palette.warningDark,
    error: palette.errorDark,
    info: palette.infoDark,
    border: '#38383A',
    shadow: palette.black,
    white: palette.white,
    black: palette.black,
  },
};

type Theme = typeof lightTheme;

const Box = createBox<Theme>();
const ThemedText = createText<Theme>();

// Themed Components
const ThemedContent = () => {
  const theme = useTheme<Theme>();
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <Box backgroundColor="mainBackground" padding="m">
        {/* Header */}
        <Box marginBottom="l">
          <ThemedText variant="header" marginBottom="s">
            🎨 Restyle Theme Demo
          </ThemedText>
          <ThemedText variant="caption">
            Type-safe styling with theme variants
          </ThemedText>
        </Box>

        {/* Text Variants */}
        <Box variant="defaults" marginBottom="m">
          <ThemedText variant="subheader" marginBottom="m">
            📝 Text Variants
          </ThemedText>
          <ThemedText variant="header" marginBottom="s">
            Header Text
          </ThemedText>
          <ThemedText variant="subheader" marginBottom="s">
            Subheader Text
          </ThemedText>
          <ThemedText variant="body" marginBottom="s">
            Body text with comfortable line height for reading.
          </ThemedText>
          <ThemedText variant="caption" marginBottom="s">
            Caption text for secondary information
          </ThemedText>
          <ThemedText variant="small">Small text for fine print</ThemedText>
        </Box>

        {/* Card Variants */}
        <Box marginBottom="m">
          <ThemedText variant="subheader" marginBottom="m">
            🃏 Card Variants
          </ThemedText>

          <Box variant="defaults" marginBottom="m">
            <ThemedText variant="body" fontWeight="600" marginBottom="s">
              Default Card
            </ThemedText>
            <ThemedText variant="caption">
              Standard card with default padding and shadow
            </ThemedText>
          </Box>

          <Box variant="elevated" marginBottom="m">
            <ThemedText variant="body" fontWeight="600" marginBottom="s">
              Elevated Card
            </ThemedText>
            <ThemedText variant="caption">
              Card with more prominent shadow for emphasis
            </ThemedText>
          </Box>

          <Box variant="outlined" marginBottom="m">
            <ThemedText variant="body" fontWeight="600" marginBottom="s">
              Outlined Card
            </ThemedText>
            <ThemedText variant="caption">
              Card with border instead of shadow
            </ThemedText>
          </Box>
        </Box>

        {/* Spacing System */}
        <Box variant="defaults" marginBottom="m">
          <ThemedText variant="subheader" marginBottom="m">
            📏 Spacing System
          </ThemedText>
          <Box flexDirection="row" flexWrap="wrap" gap="s">
            <Box backgroundColor="primary" padding="xs" borderRadius="s">
              <ThemedText variant="small" color="white">
                xs (4px)
              </ThemedText>
            </Box>
            <Box backgroundColor="primary" padding="s" borderRadius="s">
              <ThemedText variant="small" color="white">
                s (8px)
              </ThemedText>
            </Box>
            <Box backgroundColor="primary" padding="m" borderRadius="m">
              <ThemedText variant="small" color="white">
                m (16px)
              </ThemedText>
            </Box>
            <Box backgroundColor="primary" padding="l" borderRadius="l">
              <ThemedText variant="small" color="white">
                l (24px)
              </ThemedText>
            </Box>
          </Box>
        </Box>

        {/* Color Palette */}
        <Box variant="defaults" marginBottom="m">
          <ThemedText variant="subheader" marginBottom="m">
            🎨 Color Palette
          </ThemedText>
          <Box flexDirection="row" flexWrap="wrap" gap="s">
            <Box
              backgroundColor="primary"
              padding="m"
              borderRadius="m"
              width={100}
              alignItems="center"
            >
              <ThemedText variant="small" color="white">
                Primary
              </ThemedText>
            </Box>
            <Box
              backgroundColor="secondary"
              padding="m"
              borderRadius="m"
              width={100}
              alignItems="center"
            >
              <ThemedText variant="small" color="white">
                Secondary
              </ThemedText>
            </Box>
            <Box
              backgroundColor="success"
              padding="m"
              borderRadius="m"
              width={100}
              alignItems="center"
            >
              <ThemedText variant="small" color="white">
                Success
              </ThemedText>
            </Box>
            <Box
              backgroundColor="warning"
              padding="m"
              borderRadius="m"
              width={100}
              alignItems="center"
            >
              <ThemedText variant="small" color="white">
                Warning
              </ThemedText>
            </Box>
            <Box
              backgroundColor="error"
              padding="m"
              borderRadius="m"
              width={100}
              alignItems="center"
            >
              <ThemedText variant="small" color="white">
                Error
              </ThemedText>
            </Box>
            <Box
              backgroundColor="info"
              padding="m"
              borderRadius="m"
              width={100}
              alignItems="center"
            >
              <ThemedText variant="small" color="white">
                Info
              </ThemedText>
            </Box>
          </Box>
        </Box>

        {/* Interactive Component */}
        <Box variant="defaults" marginBottom="m">
          <ThemedText variant="subheader" marginBottom="m">
            🔘 Interactive Components
          </ThemedText>

          <TouchableOpacity onPress={handleIncrement}>
            <Box variant="primary" alignItems="center">
              <ThemedText variant="body" color="white" fontWeight="600">
                Tap to Increment: {count}
              </ThemedText>
            </Box>
          </TouchableOpacity>

          <Box marginTop="m">
            <TouchableOpacity onPress={() => setCount(0)}>
              <Box variant="outline" alignItems="center">
                <ThemedText variant="body" color="primary" fontWeight="600">
                  Reset Counter
                </ThemedText>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>

        {/* Border Radius */}
        <Box variant="defaults" marginBottom="m">
          <ThemedText variant="subheader" marginBottom="m">
            ⬛ Border Radius
          </ThemedText>
          <Box flexDirection="row" flexWrap="wrap" gap="m">
            <Box backgroundColor="primary" padding="l" borderRadius="s">
              <ThemedText variant="small" color="white">
                Small
              </ThemedText>
            </Box>
            <Box backgroundColor="primary" padding="l" borderRadius="m">
              <ThemedText variant="small" color="white">
                Medium
              </ThemedText>
            </Box>
            <Box backgroundColor="primary" padding="l" borderRadius="l">
              <ThemedText variant="small" color="white">
                Large
              </ThemedText>
            </Box>
            <Box backgroundColor="primary" padding="l" borderRadius="xl">
              <ThemedText variant="small" color="white">
                XLarge
              </ThemedText>
            </Box>
            <Box backgroundColor="primary" padding="l" borderRadius="round">
              <ThemedText variant="small" color="white">
                Pill
              </ThemedText>
            </Box>
          </Box>
        </Box>

        {/* Type Safety Demo */}
        <Box variant="defaults" marginBottom="xl">
          <ThemedText variant="subheader" marginBottom="m">
            ✅ Type Safety
          </ThemedText>
          <ThemedText variant="body" marginBottom="s">
            All props are type-checked at compile time:
          </ThemedText>
          <Box
            backgroundColor="cardBackground"
            borderWidth={1}
            borderColor="border"
            borderRadius="m"
            padding="m"
          >
            <ThemedText variant="small" fontFamily="monospace">
              {'<Box variant="defaults">\n'}
              {'  <ThemedText variant="body">\n'}
              {'    Type-safe!\n'}
              {'  </ThemedText>\n'}
              {'</Box>'}
            </ThemedText>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default function ThemeDemoScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <View style={styles.container}>
        {/* Theme Toggle */}
        <Box
          backgroundColor="cardBackground"
          padding="m"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="border"
        >
          <Box flexDirection="row" alignItems="center" gap="m">
            {isDarkMode ? (
              <Moon color={darkTheme.colors.text} size={24} />
            ) : (
              <Sun color={lightTheme.colors.text} size={24} />
            )}
            <ThemedText variant="body" fontWeight="600">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </ThemedText>
          </Box>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </Box>

        {/* Themed Content */}
        <ThemedContent />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



