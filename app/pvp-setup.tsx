import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

const CLASSES = [
  { id: '1', nome: 'CONFIDENT', cor: Colors.crimson },
  { id: '2', nome: 'VANGUARD', cor: Colors.cerulean },
];

export default function PvPSetupScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [classe, setClasse] = useState<string | null>(null);
  const [genero, setGenero] = useState<'male' | 'female'>('male');
  const [erro, setErro] = useState('');

  function iniciar() {
    if (!nome.trim()) { setErro('Digite um nome.'); return; }
    if (!classe) { setErro('Escolha uma classe.'); return; }
    router.push({ pathname: '/combat', params: { modo: 'pvp', nome2: nome.trim(), classe2: classe, genero2: genero } });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={styles.container}>
      <Text style={styles.header}>— JOGADOR 2 —</Text>
      <Text style={styles.hint}>* Dois entram. Um sai.</Text>

      <Text style={styles.label}>NOME</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={t => { setNome(t); setErro(''); }}
        placeholder="Nome do desafiante"
        placeholderTextColor={Colors.textDim}
        maxLength={20}
      />

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
          style={[styles.classeCard, classe === c.id && { borderColor: c.cor }]}
          onPress={() => { setClasse(c.id); setErro(''); }}
        >
          <Text style={[styles.classeNome, { color: classe === c.id ? c.cor : Colors.textDim }]}>{c.nome}</Text>
        </TouchableOpacity>
      ))}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={iniciar}>
        <Text style={styles.btnText}>▶  ENTRAR NA ARENA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={styles.btnVoltarText}>← VOLTAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 14 },
  header: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.cerulean, textAlign: 'center', letterSpacing: 3 },
  hint: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, textAlign: 'center', fontStyle: 'italic' },
  label: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, letterSpacing: 2 },
  input: {
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgPanel,
    color: Colors.textWhite, fontFamily: 'SpaceMono', fontSize: 14,
    paddingHorizontal: 16, paddingVertical: 12,
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
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgPanel,
    padding: 16,
  },
  classeNome: { fontFamily: 'SpaceMono', fontSize: 14, letterSpacing: 3 },
  erro: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.crimson, textAlign: 'center' },
  btn: { borderWidth: 1, borderColor: Colors.cerulean, backgroundColor: Colors.bgPanel, paddingVertical: 16 },
  btnText: { fontFamily: 'SpaceMono', fontSize: 14, color: Colors.cerulean, textAlign: 'center', letterSpacing: 2 },
  btnVoltar: { paddingVertical: 12 },
  btnVoltarText: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, textAlign: 'center' },
});
