import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useGameStore } from '@/store/gameStore';

const { width } = Dimensions.get('window');

export default function MenuScreen() {
  const router = useRouter();
  const jogador = useGameStore(s => s.jogador);
  const resetJogador = useGameStore(s => s.resetJogador);

  if (!jogador) { router.replace('/'); return null; }

  const hpPct = jogador.vida / jogador.vidaMax;
  const mpPct = jogador.mana / jogador.manaMax;

  return (
    <View style={styles.container}>
      <View style={styles.playerCard}>
        <View style={styles.playerHeader}>
          <Text style={styles.playerName}>{jogador.nome}</Text>
          <Text style={styles.playerLevel}>Nv.{jogador.nivel}</Text>
        </View>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>HP</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${hpPct * 100}%`, backgroundColor: Colors.hp }]} />
          </View>
          <Text style={styles.barValue}>{jogador.vida}/{jogador.vidaMax}</Text>
        </View>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>MP</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${mpPct * 100}%`, backgroundColor: Colors.mp }]} />
          </View>
          <Text style={styles.barValue}>{jogador.mana}/{jogador.manaMax}</Text>
        </View>
        <Text style={styles.xpText}>XP: {jogador.xp}/30</Text>
      </View>

      <View style={styles.divider} />
      <Text style={styles.menuTitle}>— ESCOLHA SEU DESTINO —</Text>

      <View style={styles.menuItems}>
        <MenuItem
          label="PvE  —  SOBREVIVER"
          desc="Enfrente as criaturas das trevas"
          onPress={() => router.push('/difficulty')}
          cor={Colors.crimson}
        />
        <MenuItem
          label="ARENA  —  PvP"
          desc="Lute contra outro sobrevivente"
          onPress={() => router.push('/pvp-setup')}
          cor={Colors.cerulean}
        />
      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => { resetJogador(); router.replace('/'); }}>
        <Text style={styles.btnVoltarText}>← ABANDONAR</Text>
      </TouchableOpacity>
    </View>
  );
}

function MenuItem({ label, desc, onPress, cor }: any) {
  return (
    <TouchableOpacity style={[styles.menuItem, { borderColor: cor }]} onPress={onPress}>
      <Text style={[styles.menuItemLabel, { color: cor }]}>{label}</Text>
      <Text style={styles.menuItemDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 24, gap: 16 },
  playerCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPanel,
    padding: 16,
    gap: 8,
  },
  playerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playerName: { fontFamily: 'SpaceMono', fontSize: 18, color: Colors.textWhite, letterSpacing: 2 },
  playerLevel: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.gold },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, width: 20 },
  barBg: { flex: 1, height: 8, backgroundColor: Colors.border, overflow: 'hidden' },
  barFill: { height: '100%' },
  barValue: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, width: 60, textAlign: 'right' },
  xpText: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.xp },
  divider: { height: 1, backgroundColor: Colors.border },
  menuTitle: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, textAlign: 'center', letterSpacing: 3 },
  menuItems: { gap: 12 },
  menuItem: {
    borderWidth: 1,
    backgroundColor: Colors.bgPanel,
    padding: 16,
    gap: 4,
  },
  menuItemLabel: { fontFamily: 'SpaceMono', fontSize: 14, letterSpacing: 2 },
  menuItemDesc: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim },
  btnVoltar: { marginTop: 'auto', paddingVertical: 12 },
  btnVoltarText: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, textAlign: 'center' },
});
