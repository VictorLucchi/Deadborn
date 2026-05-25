import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

const { width } = Dimensions.get('window');

const CLASSES = [
  {
    id: '1',
    nome: 'CONFIDENT',
    desc: 'Guerreiro implacável, resistente e possui ataques mais pesados',
    stats: 'FOR: 14  VIG: 14  AGI: 7  CTRL: 5',
    habilidades: ['Ataque Básico', 'Breaker Slash', 'Breaker Finisher', 'Prayer'],
    cor: Colors.crimson,
  },
  {
    id: '2',
    nome: 'VANGUARD',
    desc: 'Lâmina veloz que trabalha com critico e agilidade. Passiva: momentum',
    stats: 'FOR: 12  AGI: 14  VIG: 6  CTRL: 8',
    habilidades: ['Ataque Básico', 'Quick Strike', 'Swift Slash', 'Blitz Assault', 'Momentum (passiva)'],
    cor: Colors.cerulean,
  },
];

export default function CharacterScreen() {
  const router = useRouter();
  const setJogador = useGameStore(s => s.setJogador);
  const [nome, setNome] = useState('');
  const [classeSelecionada, setClasseSelecionada] = useState<string | null>(null);
  const [genero, setGenero] = useState<'male' | 'female'>('male');
  const [erro, setErro] = useState('');

  function confirmar() {
    if (!nome.trim()) { setErro('Digite um nome.'); return; }
    if (!classeSelecionada) { setErro('Escolha uma classe.'); return; }
    setJogador(nome.trim(), classeSelecionada, genero);
    router.replace('/menu');
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.header}>— CRIE SEU PERSONAGEM —</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>NOME</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={t => { setNome(t); setErro(''); }}
          placeholder="Como você se chama?"
          placeholderTextColor={Colors.textDim}
          maxLength={20}
        />
      </View>

      <Text style={styles.label}>GÊNERO</Text>
      <View style={styles.generoContainer}>
        <TouchableOpacity
          style={[styles.generoBtn, genero === 'male' && styles.generoBtnSelected]}
          onPress={() => setGenero('male')}
        >
          <Text style={[styles.generoText, genero === 'male' && styles.generoTextSelected]}>MASCULINO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.generoBtn, genero === 'female' && styles.generoBtnSelected]}
          onPress={() => setGenero('female')}
        >
          <Text style={[styles.generoText, genero === 'female' && styles.generoTextSelected]}>FEMININO</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>CLASSE</Text>
      {CLASSES.map(c => (
        <TouchableOpacity
          key={c.id}
          style={[styles.classeCard, classeSelecionada === c.id && { borderColor: c.cor, backgroundColor: Colors.bgCard }]}
          onPress={() => { setClasseSelecionada(c.id); setErro(''); }}
        >
          <View style={styles.classeHeader}>
            <Text style={[styles.classeNome, { color: c.cor }]}>{c.nome}</Text>
            {classeSelecionada === c.id && <Text style={[styles.selected, { color: c.cor }]}>▶ SELECIONADO</Text>}
          </View>
          <Text style={styles.classeStats}>{c.stats}</Text>
          <Text style={styles.classeDesc}>{c.desc}</Text>
          {classeSelecionada === c.id && (
            <View style={styles.habilidadesContainer}>
              <Text style={styles.habilidadesLabel}>HABILIDADES:</Text>
              {c.habilidades.map((h, i) => (
                <Text key={i} style={styles.habilidade}>  {i + 1}. {h}</Text>
              ))}
            </View>
          )}
        </TouchableOpacity>
      ))}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity
        style={[styles.btnConfirmar, (!nome.trim() || !classeSelecionada) && styles.btnDisabled]}
        onPress={confirmar}
      >
        <Text style={styles.btnText}>▶  COMEÇAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 24, paddingBottom: 48, gap: 16 },
  header: {
    fontFamily: 'SpaceMono',
    fontSize: 13,
    color: Colors.cerulean,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 8,
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.textDim,
    letterSpacing: 2,
    marginBottom: 4,
  },
  inputContainer: { gap: 4 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPanel,
    color: Colors.textWhite,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  generoContainer: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  generoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPanel,
    paddingVertical: 12,
    alignItems: 'center',
  },
  generoBtnSelected: { borderColor: Colors.cerulean, backgroundColor: Colors.bgCard },
  generoText: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.textDim },
  generoTextSelected: { color: Colors.cerulean },
  classeCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgPanel,
    padding: 16,
    gap: 6,
  },
  classeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  classeNome: { fontFamily: 'SpaceMono', fontSize: 16, letterSpacing: 3 },
  selected: { fontFamily: 'SpaceMono', fontSize: 10, letterSpacing: 1 },
  classeStats: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, letterSpacing: 1 },
  classeDesc: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textPrimary, lineHeight: 18 },
  habilidadesContainer: { marginTop: 8, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 8 },
  habilidadesLabel: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, letterSpacing: 2, marginBottom: 4 },
  habilidade: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textPrimary },
  erro: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.crimson, textAlign: 'center' },
  btnConfirmar: {
    borderWidth: 1,
    borderColor: Colors.cerulean,
    backgroundColor: Colors.bgPanel,
    paddingVertical: 16,
    marginTop: 8,
  },
  btnDisabled: { borderColor: Colors.border, opacity: 0.4 },
  btnText: { fontFamily: 'SpaceMono', fontSize: 14, color: Colors.cerulean, textAlign: 'center', letterSpacing: 2 },
});
