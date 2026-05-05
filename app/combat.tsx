import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Dimensions, Modal, Image, ImageBackground
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useRef, useState, useCallback } from 'react';
import Animated, {
  useSharedValue, useAnimatedStyle, withSequence, withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const { GameEngine, criarPersonagem } = require('../engine/GameEngine');

const ENEMY_SPRITES: Record<string, any> = {
  'Host Serpent': require('../assets/images/host-serpent.png'),
};

const BATTLE_BG: Record<string, any> = {
  'Host Serpent': require('../assets/images/floresta.jpg'),
};

const DEFAULT_BG = require('../assets/images/floresta.jpg');

// ─── Barra de status ─────────────────────────────────────────────────────────
function StatBar({ label, value, max, color, bgColor }: any) {
  const pct = Math.max(0, Math.min(value / max, 1));
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={[barStyles.bg, { backgroundColor: bgColor }]}>
        <View style={[barStyles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={barStyles.value}>{value}/{max}</Text>
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, width: 20 },
  bg: { flex: 1, height: 10, overflow: 'hidden' },
  fill: { height: '100%' },
  value: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, width: 58, textAlign: 'right' },
});

// ─── Card de personagem ───────────────────────────────────────────────────────
function CharCard({ char, isActive, isEnemy }: any) {
  const shake = useSharedValue(0);
  const prevVida = useRef(char?.vida);

  useEffect(() => {
    if (char && prevVida.current !== undefined && char.vida < prevVida.current) {
      shake.value = withSequence(
        withTiming(-6, { duration: 60 }), withTiming(6, { duration: 60 }),
        withTiming(-4, { duration: 60 }), withTiming(4, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
    prevVida.current = char?.vida;
  }, [char?.vida]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  if (!char) return null;
  const borderColor = isEnemy ? Colors.crimsonDark : (isActive ? Colors.cerulean : Colors.border);

  return (
    <Animated.View style={[cardStyles.card, { borderColor }, shakeStyle]}>
      <View style={cardStyles.header}>
        <Text style={[cardStyles.name, { color: isEnemy ? Colors.crimson : Colors.textWhite }]}>
          {isEnemy ? '☠ ' : ''}{char.nome}
        </Text>
        {!isEnemy && <Text style={cardStyles.level}>Nv.{char.nivel}</Text>}
        {char.status?.envenenado && <Text style={cardStyles.statusBadge}>☣</Text>}
        {char.status?.atordoado && <Text style={cardStyles.statusBadge}>💫</Text>}
        {char.status?.defendendo && <Text style={[cardStyles.statusBadge, { color: Colors.cerulean }]}>🛡</Text>}
        {char.status?.marcado && <Text style={[cardStyles.statusBadge, { color: Colors.gold }]}>◈×{char.quantidadeMarcas}</Text>}
      </View>
      <StatBar label="HP" value={char.vida} max={char.vidaMax} color={Colors.hp} bgColor={Colors.hpBg} />
      {char.manaMax > 0 && (
        <StatBar label="MP" value={char.mana} max={char.manaMax} color={Colors.mp} bgColor={Colors.mpBg} />
      )}
    </Animated.View>
  );
}

const cardStyles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 10, backgroundColor: Colors.bgPanel, padding: 10, gap: 6, width: width * 0.48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  name: { fontFamily: 'SpaceMono', fontSize: 13, flex: 1, letterSpacing: 1 },
  level: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.gold },
  statusBadge: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.poison },
});

// ─── Log de batalha ───────────────────────────────────────────────────────────
function AnimatedLine({ msg, color, isLast }: { msg: string; color: string; isLast: boolean }) {
  const [displayed, setDisplayed] = useState(isLast ? '' : msg);

  useEffect(() => {
    if (!isLast) { setDisplayed(msg); return; }
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(msg.slice(0, i));
      if (i >= msg.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [msg, isLast]);

  return (
    <Text style={[logStyles.line, { color }]}>
      {isLast ? '▶ ' : '  '}{displayed}
    </Text>
  );
}

function BattleLog({ logs }: { logs: string[] }) {
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, [logs]);

  return (
    <View style={logStyles.container}>
      <ScrollView ref={scrollRef} style={logStyles.scroll} showsVerticalScrollIndicator={false}>
        {logs.map((msg, i) => {
          const isCrit = msg.includes('CRÍTICO');
          const isDmg = msg.includes('causando') || msg.includes('dano');
          const isHeal = msg.includes('recuperou');
          const isStatus = msg.includes('ENVENENADO') || msg.includes('ATORDOADO') || msg.includes('SANGRANDO');
          const isVictory = msg.includes('venceu') || msg.includes('derrotado') || msg.includes('aniquilado');
          const color = isCrit ? Colors.crimsonGlow : isVictory ? Colors.gold : isHeal ? Colors.cerulean : isStatus ? Colors.poison : isDmg ? Colors.crimson : Colors.textPrimary;
          return <AnimatedLine key={i} msg={msg} color={color} isLast={i === logs.length - 1} />;
        })}
      </ScrollView>
    </View>
  );
}

const logStyles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard, height: 160, marginHorizontal: 16, marginTop: 60 },
  scroll: { padding: 10 },
  line: { fontFamily: 'SpaceMono', fontSize: 15, lineHeight: 22 },
});

// ─── Tela principal de combate ────────────────────────────────────────────────
export default function CombatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const jogador = useGameStore(s => s.jogador);
  const restaurarJogador = useGameStore(s => s.restaurarJogador);

  const engineRef = useRef<any>(null);
  const [estado, setEstado] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [modalAberto, setModalAberto] = useState<'habilidades' | 'itens' | 'armas' | null>(null);
  const [combateFinalizado, setCombateFinalizado] = useState(false);

  const addLogs = useCallback((msgs: string[]) => {
    setLogs(prev => [...prev, ...msgs]);
  }, []);

  useEffect(() => {
    if (!jogador) return;
    const engine = new GameEngine((msg: string) => addLogs([msg]));
    engineRef.current = engine;

    if (params.modo === 'pve') {
      const dif = parseInt(params.dificuldade as string) || 1;
      const novoEstado = engine.iniciarPvE(jogador, null, dif);
      setEstado({ ...novoEstado });
    } else if (params.modo === 'pvp') {
      const j2 = criarPersonagem(params.nome2 as string, params.classe2 as string);
      const novoEstado = engine.iniciarPvP(jogador, j2);
      setEstado({ ...novoEstado });
    }
  }, []);

  function executarAcao(tipo: string, indice = 0) {
    const engine = engineRef.current;
    if (!engine || !engine.emAndamento) return;
    const resultado = engine.executarAcaoJogador(tipo, indice);
    if (resultado?.then) {
      resultado.then((r: any) => {
        addLogs(r.msgs);
        setEstado({ ...engine.getEstado() });
        if (!engine.emAndamento) { setCombateFinalizado(true); restaurarJogador(); }
      });
    } else {
      addLogs(resultado.msgs);
      setEstado({ ...engine.getEstado() });
      if (!engine.emAndamento) { setCombateFinalizado(true); restaurarJogador(); }
    }
    setModalAberto(null);
  }

  if (!estado || !jogador) return <View style={styles.container}><Text style={styles.loading}>Carregando...</Text></View>;

  const engine = engineRef.current;
  const jogadorAtual = estado.jogadorAtual;
  const inimigo = estado.inimigo;
  const isPvP = estado.modo === 'pvp';
  const consumiveis = engine ? engine.getConsumiveis(jogadorAtual) : [];
  const armas = engine ? engine.getArmas(jogadorAtual) : [];
  const isMinhaVez = !isPvP || estado.jogadores[0] === jogadorAtual;
  const inimigoNome = inimigo?.nome ?? '';
  const sprite = ENEMY_SPRITES[inimigoNome] ?? null;
  const bg = BATTLE_BG[inimigoNome] ?? DEFAULT_BG;

  return (
    <View style={styles.container}>
      <View style={styles.turnBadge}>
        <Text style={styles.turnText}>TURNO {estado.turno}  —  {jogadorAtual?.nome?.toUpperCase()}</Text>
      </View>

      <ImageBackground source={bg} style={styles.battlefield} imageStyle={styles.battlefieldImg}>
        <View style={styles.overlay} />
        <View style={styles.charsContainer}>
          <View style={styles.cardLeft}>
            <CharCard
              char={isPvP ? estado.jogadores[0] : jogador}
              isActive={!isPvP || jogadorAtual === estado.jogadores[0]}
              isEnemy={false}
            />
          </View>
          <View style={styles.cardRight}>
            <CharCard
              char={isPvP ? estado.jogadores[1] : inimigo}
              isActive={isPvP && jogadorAtual === estado.jogadores[1]}
              isEnemy={!isPvP}
            />
            {!isPvP && sprite && (
              <Image source={sprite} style={styles.enemySprite} resizeMode="contain" />
            )}
          </View>
        </View>
      </ImageBackground>

      <BattleLog logs={logs} />

      {!combateFinalizado ? (
        <View style={styles.actionsContainer}>
          <View style={styles.actionsGrid}>
            <ActionBtn label="⚔  LUTAR" color={Colors.crimson} onPress={() => setModalAberto('habilidades')} disabled={!isMinhaVez} />
            <ActionBtn label="🎒  ITEM" color={Colors.cerulean} onPress={() => setModalAberto('itens')} disabled={!isMinhaVez} />
            <ActionBtn label="🗡  ARMA" color={Colors.gold} onPress={() => setModalAberto('armas')} disabled={!isMinhaVez} />
            <ActionBtn label="🏃  FUGIR" color={Colors.textDim} onPress={() => executarAcao('fugir')} disabled={!isMinhaVez} />
          </View>
        </View>
      ) : (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.btnFim} onPress={() => router.replace('/menu')}>
            <Text style={styles.btnFimText}>▶  CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalAberto === 'habilidades'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>— HABILIDADES —</Text>
            {jogadorAtual?.habilidades?.map((h: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={[styles.modalItem, !h.podeUsar(jogadorAtual) && styles.modalItemDisabled]}
                onPress={() => h.podeUsar(jogadorAtual) && executarAcao('habilidade', i)}
              >
                <Text style={[styles.modalItemText, !h.podeUsar(jogadorAtual) && { color: Colors.textDim }]}>{h.nome}</Text>
                <Text style={styles.modalItemCost}>{h.custoMana > 0 ? `${h.custoMana} MP` : 'Grátis'}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalAberto(null)}>
              <Text style={styles.modalCloseText}>← VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalAberto === 'itens'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>— CONSUMÍVEIS —</Text>
            {consumiveis.length === 0 && <Text style={styles.modalEmpty}>Nenhum item disponível.</Text>}
            {consumiveis.map((grupo: any, i: number) => (
              <TouchableOpacity key={i} style={styles.modalItem} onPress={() => executarAcao('item', i)}>
                <Text style={styles.modalItemText}>{grupo.item.nome}</Text>
                <Text style={styles.modalItemCost}>×{grupo.quantidade}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalAberto(null)}>
              <Text style={styles.modalCloseText}>← VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalAberto === 'armas'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>— EQUIPAMENTOS —</Text>
            <Text style={styles.modalEquipada}>Equipada: {jogadorAtual?.armaEquipada?.nome ?? 'Nenhuma'}</Text>
            {armas.length === 0 && <Text style={styles.modalEmpty}>Nenhuma arma no inventário.</Text>}
            {armas.map((arma: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={styles.modalItem}
                onPress={() => { jogadorAtual.equiparArma(arma); setEstado({ ...engine.getEstado() }); setModalAberto(null); addLogs([`${arma.nome} equipada!`]); }}
              >
                <Text style={styles.modalItemText}>{arma.nome}</Text>
                <Text style={styles.modalItemCost}>+{arma.danoAtaque} ATK</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalAberto(null)}>
              <Text style={styles.modalCloseText}>← VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ActionBtn({ label, color, onPress, disabled }: any) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, { borderColor: disabled ? Colors.border : color }, disabled && styles.actionBtnDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.actionBtnText, { color: disabled ? Colors.textDim : color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 16, gap: 12 },
  loading: { fontFamily: 'SpaceMono', color: Colors.textDim, textAlign: 'center', marginTop: 100 },
  turnBadge: { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 8 },
  turnText: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, textAlign: 'center', letterSpacing: 2 },
  battlefield: { width: '100%', height: 260, justifyContent: 'flex-end' },
  battlefieldImg: { borderRadius: 8, opacity: 0.85 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,8,16,0.45)', borderRadius: 8 },
  enemySprite: { width: '100%', height: 143, marginTop: 6 },
  charsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 8, paddingBottom: 8, height: 200 },
  cardLeft: { position: 'absolute', bottom: 8, left: 8 },
  cardRight: { position: 'absolute', top: 8, right: 8 },
  actionsContainer: { marginTop: 'auto' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionBtn: { flex: 1, minWidth: '45%', borderWidth: 1, backgroundColor: Colors.bgPanel, paddingVertical: 14, paddingHorizontal: 8 },
  actionBtnDisabled: { opacity: 0.4 },
  actionBtnText: { fontFamily: 'SpaceMono', fontSize: 12, textAlign: 'center', letterSpacing: 1 },
  btnFim: { borderWidth: 1, borderColor: Colors.cerulean, backgroundColor: Colors.bgPanel, paddingVertical: 16 },
  btnFimText: { fontFamily: 'SpaceMono', fontSize: 14, color: Colors.cerulean, textAlign: 'center', letterSpacing: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: Colors.bgPanel, borderTopWidth: 1, borderTopColor: Colors.ceruleanDark, padding: 20, gap: 8 },
  modalTitle: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.cerulean, textAlign: 'center', letterSpacing: 3, marginBottom: 4 },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalItemDisabled: { opacity: 0.4 },
  modalItemText: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.textPrimary },
  modalItemCost: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim },
  modalEquipada: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.gold, marginBottom: 4 },
  modalEmpty: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, textAlign: 'center', paddingVertical: 12 },
  modalClose: { paddingVertical: 12 },
  modalCloseText: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, textAlign: 'center' },
});
