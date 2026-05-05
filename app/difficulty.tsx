import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

const DIFICULDADES = [
  { id: 1, label: 'GOBLIN', desc: '150 HP  |  Ágil e traiçoeiro', xp: '10 XP', cor: Colors.cerulean },
  { id: 2, label: 'BROODHOST WALKER', desc: '400 HP  |  Lento mas resistente', xp: '25 XP', cor: Colors.gold },
  { id: 3, label: 'HUNTER', desc: '200 HP  |  Veneno e drenagem de vida', xp: '30 XP', cor: Colors.crimson },
  { id: 4, label: 'HOST SERPENT', desc: '900 HP  |  Boss. Extremamente ágil', xp: '100 XP', cor: Colors.crimsonGlow },
];

export default function DifficultyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>— ESCOLHA SEU INIMIGO —</Text>
      <Text style={styles.hint}>* Cada criatura carrega sua própria maldição.</Text>

      <View style={styles.list}>
        {DIFICULDADES.map(d => (
          <TouchableOpacity
            key={d.id}
            style={[styles.card, { borderColor: d.cor }]}
            onPress={() => router.push({ pathname: '/combat', params: { modo: 'pve', dificuldade: d.id } })}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardLabel, { color: d.cor }]}>{d.label}</Text>
              <Text style={[styles.cardXp, { color: d.cor }]}>{d.xp}</Text>
            </View>
            <Text style={styles.cardDesc}>{d.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={styles.btnVoltarText}>← VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 24, gap: 16 },
  header: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.cerulean, textAlign: 'center', letterSpacing: 3 },
  hint: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, textAlign: 'center', fontStyle: 'italic' },
  list: { gap: 12, flex: 1 },
  card: { borderWidth: 1, backgroundColor: Colors.bgPanel, padding: 16, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontFamily: 'SpaceMono', fontSize: 14, letterSpacing: 2 },
  cardXp: { fontFamily: 'SpaceMono', fontSize: 11 },
  cardDesc: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim },
  btnVoltar: { paddingVertical: 12 },
  btnVoltarText: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, textAlign: 'center' },
});
