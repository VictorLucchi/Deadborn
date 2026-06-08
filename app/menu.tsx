import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useGameStore } from '@/store/gameStore';

const { width } = Dimensions.get('window');

export default function MenuScreen() {
  const router = useRouter();
  const jogador = useGameStore(s => s.jogador);
  const resetJogador = useGameStore(s => s.resetJogador);

  if (!jogador) { router.replace('/'); return null; }

  // Cálculos dinâmicos das barras
  const hpPct = Math.min(jogador.vida / jogador.vidaMax, 1);
  const mpPct = Math.min(jogador.mana / jogador.manaMax, 1);
  const xpNecessario = typeof jogador.getXpNecessario === 'function' ? jogador.getXpNecessario() : 30;
  const xpPct = Math.min(jogador.xp / xpNecessario, 1);

  return (
    <ImageBackground source={require('@/assets/images/Menu.jpg')} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.container}>
      <View style={styles.playerCard}>
        <View style={styles.playerHeader}>
          <Text style={styles.playerName}>{jogador.nome}</Text>
          <Text style={styles.playerLevel}>Nv.{jogador.nivel}</Text>
        </View>
        
        {/* Barra de HP */}
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>HP</Text>
          <View style={[styles.barBg, { backgroundColor: Colors.hpBg }]}>
            <View style={[styles.barFill, { width: `${hpPct * 100}%`, backgroundColor: Colors.hp }]} />
          </View>
          <Text style={styles.barValue}>{jogador.vida}/{jogador.vidaMax}</Text>
        </View>

        {/* Barra de MP */}
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>MP</Text>
          <View style={[styles.barBg, { backgroundColor: Colors.mpBg }]}>
            <View style={[styles.barFill, { width: `${mpPct * 100}%`, backgroundColor: Colors.mp }]} />
          </View>
          <Text style={styles.barValue}>{jogador.mana}/{jogador.manaMax}</Text>
        </View>

        {/* Barra de XP Dinâmica */}
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>XP</Text>
          <View style={[styles.barBg, { backgroundColor: '#1A0A2A' }]}>
            <View style={[styles.barFill, { width: `${xpPct * 100}%`, backgroundColor: Colors.xp }]} />
          </View>
          <Text style={styles.barValue}>{jogador.xp}/{xpNecessario}</Text>
        </View>

        {/* Pontos Disponíveis */}
        {jogador.pontosDisponiveis > 0 && (
          <Text style={styles.pontosText}>⬆ {jogador.pontosDisponiveis} ponto{jogador.pontosDisponiveis > 1 ? 's' : ''} disponível{jogador.pontosDisponiveis > 1 ? 'is' : ''} — acesse FICHA</Text>
        )}
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
        <MenuItem
          label="FICHA  —  STATUS"
          desc="Atributos, habilidades e inventário"
          onPress={() => router.push('/status')}
          cor={Colors.gold}
        />
      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => { resetJogador(); router.replace('/'); }}>
        <Text style={styles.btnVoltarText}>← ABANDONAR</Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
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
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,0,15,0.55)' },
  container: { flex: 1, padding: 24, gap: 16 },
  playerCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPanel,
    padding: 16,
    gap: 10,
  },
  playerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  playerName: { fontFamily: 'SpaceMono', fontSize: 18, color: Colors.textWhite, letterSpacing: 2 },
  playerLevel: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.gold },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, width: 20 },
  barBg: { flex: 1, height: 10, overflow: 'hidden' },
  barFill: { height: '100%' },
  barValue: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, width: 60, textAlign: 'right' },
  pontosText: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.gold, marginTop: 4 },
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
