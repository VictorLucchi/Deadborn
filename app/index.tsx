import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 1800 }), withTiming(0.4, { duration: 1800 })),
      -1, false
    );
    const t = setTimeout(() => setSubtitleVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <View style={styles.container}>
      <View style={styles.topDecor} />

      <View style={styles.titleContainer}>
        <Animated.Text style={[styles.titleGlow, glowStyle]}>DEADBORN</Animated.Text>
        <Text style={styles.title}>DEADBORN</Text>
        {subtitleVisible && (
          <Text style={styles.subtitle}>— The Beginning —</Text>
        )}
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/character')}>
          <Text style={styles.btnText}>▶  NOVA JORNADA</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.hint}>* Nas trevas, apenas os mortos conhecem a verdade.</Text>
      </View>

      <View style={styles.bottomDecor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  topDecor: {
    width: width * 0.6,
    height: 1,
    backgroundColor: Colors.ceruleanDark,
    opacity: 0.5,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  titleGlow: {
    position: 'absolute',
    fontFamily: 'SpaceMono',
    fontSize: 48,
    color: Colors.crimson,
    textShadowColor: Colors.crimsonGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 12,
  },
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 48,
    color: Colors.textWhite,
    letterSpacing: 12,
  },
  subtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: Colors.cerulean,
    marginTop: 12,
    letterSpacing: 4,
  },
  menuContainer: {
    width: width * 0.75,
    alignItems: 'center',
    gap: 16,
  },
  btn: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.cerulean,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.bgPanel,
  },
  btnText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: Colors.cerulean,
    textAlign: 'center',
    letterSpacing: 2,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border,
  },
  hint: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.textDim,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomDecor: {
    width: width * 0.6,
    height: 1,
    backgroundColor: Colors.crimsonDark,
    opacity: 0.5,
  },
});
