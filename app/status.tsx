import { Colors } from '@/constants/theme';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';

const ABAS = ['FICHA', 'HABILIDADES', 'INVENTÁRIO'] as const;
type Aba = typeof ABAS[number];

const STATS = [
  { key: 'forca',     label: 'FOR', desc: 'Aumenta dano físico' },
  { key: 'agilidade', label: 'AGI', desc: 'Aumenta chance de crítico e velocidade' },
  { key: 'vigor',     label: 'VIG', desc: 'Aumenta HP máximo (+5 por ponto)' },
  { key: 'controle',  label: 'CTRL', desc: 'Aumenta MP máximo (+2 por ponto)' },
] as const;

export default function StatusScreen() {
  const router = useRouter();
  const jogador = useGameStore(s => s.jogador);
  const distribuirPonto = useGameStore(s => s.distribuirPonto);
  const equiparArma = useGameStore(s => s.equiparArma);
  const usarItem = useGameStore(s => s.usarItem);
  const [aba, setAba] = useState<Aba>('FICHA');
  const [toast, setToast] = useState<string | null>(null);
  const [pendente, setPendente] = useState<Record<string, number>>({});
  const [itemEmUso, setItemEmUso] = useState<any>(null);
  const [habilidadeEscolha, setHabilidadeEscolha] = useState<number | null>(null);

  if (!jogador) { router.replace('/'); return null; }

  const totalPendente = Object.values(pendente).reduce((a, b) => a + b, 0);
  const pontosRestantes = jogador.pontosDisponiveis - totalPendente;

  function adicionarPendente(stat: string) {
    if (pontosRestantes <= 0) return;
    setPendente(p => ({ ...p, [stat]: (p[stat] ?? 0) + 1 }));
  }

  function removerPendente(stat: string) {
    if (!pendente[stat] || pendente[stat] <= 0) return;
    setPendente(p => ({ ...p, [stat]: p[stat] - 1 }));
  }

  function confirmarPontos() {
    Object.entries(pendente).forEach(([stat, qtd]) => {
      for (let i = 0; i < qtd; i++) distribuirPonto(stat);
    });
    setPendente({});
    mostrarToast('Atributos confirmados!');
  }

  // Forçar a chamada do método se ele existir no protótipo ou na instância
  const xpNecessario = typeof jogador.getXpNecessario === 'function' ? jogador.getXpNecessario() : 30;
  const xpPct = Math.min(jogador.xp / xpNecessario, 1);
  const hpPct = Math.min(jogador.vida / jogador.vidaMax, 1);
  const mpPct = Math.min(jogador.mana / jogador.manaMax, 1);

  const armas = jogador.inventario.filter((i: any) => i.slot === 'arma');
  const consumiveis: any[] = [];
  const materiais: any[] = [];
  jogador.inventario.forEach((i: any) => {
    if (i.tipo === 'consumivel') consumiveis.push(i);
    else if (i.tipo === 'material') materiais.push(i);
  });

  function mostrarToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleEquipar(arma: any) {
    equiparArma(arma);
    mostrarToast(`${arma.nome} equipada!`);
  }

  async function handleUsar(item: any) {
    // Abyssal Blood é do tipo 'consumivel', Mutated Core é 'material'
    if (item.nome === 'Mutated Core' || item.nome === 'Abyssal Blood') {
      setItemEmUso(item);
      setHabilidadeEscolha(null);
    } else {
      const msg = await usarItem(item);
      if (msg) mostrarToast(msg);
    }
  }

  async function confirmarEvolucao(indiceHabilidade: number) {
    if (!itemEmUso) return;
    const msg = await usarItem(itemEmUso);
    if (msg) {
      const resultado = await itemEmUso.usar(jogador, indiceHabilidade);
      if (resultado?.mensagem) mostrarToast(resultado.mensagem);
    }
    setItemEmUso(null);
    setHabilidadeEscolha(null);
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.nome}>{jogador.nome}</Text>
          <Text style={s.classe}>{jogador.constructor.name.toUpperCase()}  —  Nv.{jogador.nivel}</Text>
        </View>
        {jogador.pontosDisponiveis > 0 && (
          <View style={s.pontoBadge}>
            <Text style={s.pontoBadgeText}>+{pontosRestantes} pts</Text>
          </View>
        )}
      </View>

      {/* Barras rápidas */}
      <View style={s.barsRow}>
        <MiniBar label="HP" value={jogador.vida} max={jogador.vidaMax} pct={hpPct} color={Colors.hp} bg={Colors.hpBg} />
        <MiniBar label="MP" value={jogador.mana} max={jogador.manaMax} pct={mpPct} color={Colors.mp} bg={Colors.mpBg} />
        <MiniBar label="XP" value={jogador.xp} max={xpNecessario} pct={xpPct} color={Colors.xp} bg="#1A0A2A" />
      </View>

      {/* Abas */}
      <View style={s.tabs}>
        {ABAS.map(a => (
          <TouchableOpacity key={a} style={[s.tab, aba === a && s.tabActive]} onPress={() => setAba(a)}>
            <Text style={[s.tabText, aba === a && s.tabTextActive]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── FICHA ── */}
        {aba === 'FICHA' && (
          <View style={s.section}>
            {jogador.pontosDisponiveis > 0 && (
              <View style={s.alertBox}>
                <Text style={s.alertText}>⬆ {pontosRestantes} ponto{pontosRestantes !== 1 ? 's' : ''} restante{pontosRestantes !== 1 ? 's' : ''}</Text>
              </View>
            )}
            <Text style={s.sectionTitle}>ATRIBUTOS</Text>
            {STATS.map(({ key, label, desc }) => {
              const pts = pendente[key] ?? 0;
              return (
                <View key={key} style={s.statRow}>
                  <View style={s.statInfo}>
                    <Text style={s.statLabel}>{label}</Text>
                    <Text style={s.statValue}>{jogador[key]}</Text>
                    {pts > 0 && <Text style={s.statPendente}>+{pts}</Text>}
                    <Text style={s.statDesc}>{desc}</Text>
                  </View>
                  {jogador.pontosDisponiveis > 0 && (
                    <View style={s.statBtns}>
                      {pts > 0 && (
                        <TouchableOpacity style={s.btnMenos} onPress={() => removerPendente(key)}>
                          <Text style={s.btnMenosText}>−</Text>
                        </TouchableOpacity>
                      )}
                      {pontosRestantes > 0 && (
                        <TouchableOpacity style={s.btnPonto} onPress={() => adicionarPendente(key)}>
                          <Text style={s.btnPontoText}>+</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            })}

            {totalPendente > 0 && (
              <TouchableOpacity style={s.btnConfirmar} onPress={confirmarPontos}>
                <Text style={s.btnConfirmarText}>✓  CONFIRMAR DISTRIBUIÇÃO</Text>
              </TouchableOpacity>
            )}

            <Text style={[s.sectionTitle, { marginTop: 20 }]}>COMBATE</Text>
            <InfoRow label="Dano base" value={`${jogador.forca + jogador.getDanoArma()}`} />
            <InfoRow label="Arma equipada" value={jogador.armaEquipada?.nome ?? 'Nenhuma'} />
            <InfoRow label="Bônus arma" value={jogador.armaEquipada ? `+${jogador.armaEquipada.danoAtaque} ATK` : '—'} />
          </View>
        )}

        {/* ── HABILIDADES ── */}
        {aba === 'HABILIDADES' && (
          <View style={s.section}>
            {jogador.habilidades.map((h: any, i: number) => {
              const fortalecida = jogador.habilidadesFortalecidas?.[i] ?? 0;
              const evoluida = jogador.habilidadesEvoluidas?.[i] ?? 0;
              return (
                <View key={i} style={s.habilidadeCard}>
                  <View style={s.habilidadeHeader}>
                    <Text style={s.habilidadeNome}>{h.nome}</Text>
                    <View style={s.habilidadeTags}>
                      {h.custoMana > 0
                        ? <Text style={s.tagMana}>{h.custoMana} MP</Text>
                        : <Text style={s.tagGratis}>GRÁTIS</Text>
                      }
                      {fortalecida > 0 && <Text style={s.tagForte}>+{fortalecida}</Text>}
                      {evoluida > 0 && <Text style={s.tagEvol}>EVO {evoluida}</Text>}
                    </View>
                  </View>
                  {h.descricao && <Text style={s.habilidadeDesc}>{h.descricao}</Text>}
                  {(h.variacaoMin !== undefined) && (
                    <Text style={s.habilidadeStat}>Dano: {h.variacaoMin}–{h.variacaoMax}</Text>
                  )}
                  {(h.chanceCritico !== undefined) && (
                    <Text style={s.habilidadeStat}>Crítico: {Math.round(h.chanceCritico * 100)}%</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

      {/* Modal de escolha de habilidade */}
      <Modal visible={!!itemEmUso} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Escolha uma habilidade para {itemEmUso?.nome === 'Mutated Core' ? 'EVOLUIR' : 'FORTALECER'}</Text>
            <ScrollView style={s.modalScroll}>
              {jogador?.habilidades?.map((h: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  style={[s.modalItem, habilidadeEscolha === i && s.modalItemSelected]}
                  onPress={() => setHabilidadeEscolha(i)}
                >
                  <Text style={s.modalItemText}>{h.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtn, { borderColor: Colors.cerulean }]}
                onPress={() => { setItemEmUso(null); setHabilidadeEscolha(null); }}
              >
                <Text style={[s.modalBtnText, { color: Colors.cerulean }]}>✕ CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalBtn, habilidadeEscolha !== null ? { borderColor: Colors.xp } : { borderColor: Colors.textDim }]}
                onPress={() => habilidadeEscolha !== null && confirmarEvolucao(habilidadeEscolha)}
                disabled={habilidadeEscolha === null}
              >
                <Text style={[s.modalBtnText, habilidadeEscolha !== null ? { color: Colors.xp } : { color: Colors.textDim }]}>✓ CONFIRMAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── INVENTÁRIO ── */}
        {aba === 'INVENTÁRIO' && (
          <View style={s.section}>
            {jogador.armaEquipada && (
              <>
                <Text style={s.sectionTitle}>EQUIPADA</Text>
                <ItemCard
                  item={jogador.armaEquipada}
                  equipada
                  onDesequipar={() => { handleEquipar(jogador.armaEquipada); }}
                />
              </>
            )}
            {armas.length > 0 && (
              <>
                <Text style={[s.sectionTitle, { marginTop: jogador.armaEquipada ? 16 : 0 }]}>ARMAS NO INVENTÁRIO</Text>
                {armas.map((item: any, i: number) => (
                  <ItemCard key={i} item={item} onEquipar={() => handleEquipar(item)} />
                ))}
              </>
            )}
            {consumiveis.length > 0 && (
              <>
                <Text style={[s.sectionTitle, { marginTop: 16 }]}>CONSUMÍVEIS</Text>
                {agrupar(consumiveis).map((g: any, i: number) => (
                  <ItemCard key={i} item={g.item} quantidade={g.quantidade} onUsar={() => handleUsar(g.item)} />
                ))}
              </>
            )}
            {materiais.length > 0 && (
              <>
                <Text style={[s.sectionTitle, { marginTop: 16 }]}>MATERIAIS</Text>
                {agrupar(materiais).map((g: any, i: number) => (
                  <ItemCard key={i} item={g.item} quantidade={g.quantidade} onUsar={() => handleUsar(g.item)} />
                ))}
              </>
            )}
            {armas.length === 0 && consumiveis.length === 0 && materiais.length === 0 && !jogador.armaEquipada && (
              <Text style={s.vazio}>Inventário vazio.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Toast */}
      <Modal visible={!!toast} transparent animationType="fade">
        <View style={s.toastOverlay} pointerEvents="none">
          <View style={s.toastBox}>
            <Text style={s.toastText}>{toast}</Text>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={s.btnVoltar} onPress={() => router.back()}>
        <Text style={s.btnVoltarText}>← FECHAR FICHA</Text>
      </TouchableOpacity>
    </View>
  );
}

function MiniBar({ label, value, max, pct, color, bg }: any) {
  return (
    <View style={s.miniBarContainer}>
      <Text style={s.miniBarLabel}>{label}</Text>
      <View style={[s.miniBarBg, { backgroundColor: bg }]}>
        <View style={[s.miniBarFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.miniBarValue}>{value}/{max}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

function ItemCard({ item, quantidade, equipada, onEquipar, onUsar, onDesequipar }: {
  item: any; quantidade?: number; equipada?: boolean;
  onEquipar?: () => void; onUsar?: () => void; onDesequipar?: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const isArma = item.slot === 'arma';
  const isConsumivel = item.tipo === 'consumivel' || item.tipo === 'material';

  return (
    <View style={[s.itemCard, equipada && s.itemCardEquipada]}>
      <TouchableOpacity onPress={() => setAberto(v => !v)} activeOpacity={0.8}>
        <View style={s.itemHeader}>
          <Text style={[s.itemNome, equipada && { color: Colors.gold }]}>{item.nome}</Text>
          <View style={s.itemTags}>
            {equipada && <Text style={s.tagEquipada}>EQUIPADA</Text>}
            {item.danoAtaque > 0 && <Text style={s.tagAtk}>+{item.danoAtaque} ATK</Text>}
            {quantidade && quantidade > 1 && <Text style={s.tagQtd}>×{quantidade}</Text>}
            <Text style={s.itemToggle}>{aberto ? '▲' : '▼'}</Text>
          </View>
        </View>
        {aberto && item.descricao ? (
          <Text style={s.itemDesc}>{item.descricao}</Text>
        ) : null}
      </TouchableOpacity>

      {aberto && (
        <View style={s.itemActions}>
          {isArma && !equipada && onEquipar && (
            <TouchableOpacity style={[s.itemBtn, { borderColor: Colors.gold }]} onPress={onEquipar}>
              <Text style={[s.itemBtnText, { color: Colors.gold }]}>⚔ EQUIPAR</Text>
            </TouchableOpacity>
          )}
          {isArma && equipada && onDesequipar && (
            <TouchableOpacity style={[s.itemBtn, { borderColor: Colors.textDim }]} onPress={onDesequipar}>
              <Text style={[s.itemBtnText, { color: Colors.textDim }]}>✕ DESEQUIPAR</Text>
            </TouchableOpacity>
          )}
          {isConsumivel && onUsar && (
            <TouchableOpacity style={[s.itemBtn, { borderColor: Colors.cerulean }]} onPress={onUsar}>
              <Text style={[s.itemBtnText, { color: Colors.cerulean }]}>▶ USAR</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

function agrupar(lista: any[]) {
  const map: Record<string, { item: any; quantidade: number }> = {};
  lista.forEach(i => {
    if (!map[i.nome]) map[i.nome] = { item: i, quantidade: 0 };
    map[i.nome].quantidade++;
  });
  return Object.values(map);
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, paddingTop: 48, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  nome: { fontFamily: 'SpaceMono', fontSize: 20, color: Colors.textWhite, letterSpacing: 2 },
  classe: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, marginTop: 2, letterSpacing: 1 },
  pontoBadge: { backgroundColor: Colors.xp, paddingHorizontal: 10, paddingVertical: 4 },
  pontoBadgeText: { fontFamily: 'SpaceMono', fontSize: 11, color: '#fff', letterSpacing: 1 },

  barsRow: { gap: 6, marginBottom: 16 },
  miniBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniBarLabel: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, width: 22 },
  miniBarBg: { flex: 1, height: 8, overflow: 'hidden' },
  miniBarFill: { height: '100%' },
  miniBarValue: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, width: 60, textAlign: 'right' },

  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.cerulean },
  tabText: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, letterSpacing: 2 },
  tabTextActive: { color: Colors.cerulean },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  section: { gap: 8 },

  alertBox: { borderWidth: 1, borderColor: Colors.xp, backgroundColor: '#1A0A2A', padding: 10, marginBottom: 4 },
  alertText: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.xp, textAlign: 'center', letterSpacing: 1 },

  sectionTitle: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, letterSpacing: 3, marginBottom: 4 },

  statRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgPanel, padding: 12 },
  statInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  statLabel: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.cerulean, width: 36, letterSpacing: 1 },
  statValue: { fontFamily: 'SpaceMono', fontSize: 18, color: Colors.textWhite, width: 30 },
  statDesc: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, flex: 1 },
  statPendente: { fontFamily: 'SpaceMono', fontSize: 14, color: Colors.xp, marginRight: 4 },
  statBtns: { flexDirection: 'row', gap: 8 },
  btnMenos: { width: 44, height: 44, borderWidth: 2, borderColor: Colors.crimson, backgroundColor: 'rgba(220, 53, 69, 0.15)', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  btnMenosText: { fontFamily: 'SpaceMono', fontSize: 22, color: Colors.crimson, lineHeight: 24, fontWeight: 'bold' },
  btnPonto: { width: 44, height: 44, borderWidth: 2, borderColor: Colors.xp, backgroundColor: 'rgba(255, 193, 7, 0.2)', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  btnPontoText: { fontFamily: 'SpaceMono', fontSize: 22, color: Colors.xp, lineHeight: 24, fontWeight: 'bold' },
  btnConfirmar: {
    borderWidth: 2, borderColor: Colors.xp, backgroundColor: 'rgba(255, 193, 7, 0.15)',
    paddingVertical: 14, alignItems: 'center', marginTop: 8, borderRadius: 4,
  },
  btnConfirmarText: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.xp, letterSpacing: 2, fontWeight: 'bold' },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim },
  infoValue: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textPrimary },

  habilidadeCard: { borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgPanel, padding: 12, gap: 4 },
  habilidadeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  habilidadeNome: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.textWhite, letterSpacing: 1 },
  habilidadeTags: { flexDirection: 'row', gap: 6 },
  habilidadeDesc: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, lineHeight: 16 },
  habilidadeStat: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.cerulean },
  tagMana: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.mp, borderWidth: 1, borderColor: Colors.mp, paddingHorizontal: 4, paddingVertical: 1 },
  tagGratis: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.textDim, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 4, paddingVertical: 1 },
  tagForte: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.gold, borderWidth: 1, borderColor: Colors.gold, paddingHorizontal: 4, paddingVertical: 1 },
  tagEvol: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.crimsonGlow, borderWidth: 1, borderColor: Colors.crimsonGlow, paddingHorizontal: 4, paddingVertical: 1 },

  itemCard: { borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgPanel, padding: 12, gap: 4 },
  itemCardEquipada: { borderColor: Colors.gold },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemNome: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.textPrimary, flex: 1 },
  itemTags: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  itemDesc: { fontFamily: 'SpaceMono', fontSize: 10, color: Colors.textDim, lineHeight: 16, marginTop: 4 },
  itemToggle: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.textDim, textAlign: 'right' },
  tagEquipada: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.gold, borderWidth: 1, borderColor: Colors.gold, paddingHorizontal: 4, paddingVertical: 1 },
  tagAtk: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.crimson, borderWidth: 1, borderColor: Colors.crimson, paddingHorizontal: 4, paddingVertical: 1 },
  tagQtd: { fontFamily: 'SpaceMono', fontSize: 9, color: Colors.textDim },

  vazio: { fontFamily: 'SpaceMono', fontSize: 11, color: Colors.textDim, textAlign: 'center', paddingVertical: 24 },
  itemActions: { flexDirection: 'row', gap: 8, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  itemBtn: { flex: 1, borderWidth: 1, paddingVertical: 8, alignItems: 'center' },
  itemBtnText: { fontFamily: 'SpaceMono', fontSize: 11, letterSpacing: 1 },
  toastOverlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80 },
  toastBox: { backgroundColor: Colors.bgPanel, borderWidth: 1, borderColor: Colors.ceruleanDark, paddingHorizontal: 20, paddingVertical: 10 },
  toastText: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.cerulean, letterSpacing: 1 },
  btnVoltar: {
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: Colors.cerulean,
    backgroundColor: Colors.bgPanel,
    alignItems: 'center',
  },
  btnVoltarText: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.cerulean, letterSpacing: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: Colors.bgPanel, borderWidth: 3, borderColor: Colors.cerulean, padding: 20, width: '88%', maxHeight: '75%', borderRadius: 6 },
  modalTitle: { fontFamily: 'SpaceMono', fontSize: 13, color: Colors.cerulean, marginBottom: 16, letterSpacing: 2, fontWeight: 'bold', textAlign: 'center' },
  modalScroll: { maxHeight: 320, marginBottom: 16 },
  modalItem: { borderWidth: 2, borderColor: Colors.border, padding: 14, marginBottom: 8, backgroundColor: Colors.bg, borderRadius: 4 },
  modalItemSelected: { borderColor: Colors.xp, backgroundColor: 'rgba(255, 193, 7, 0.15)', borderWidth: 3 },
  modalItemText: { fontFamily: 'SpaceMono', fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBtn: { flex: 1, borderWidth: 2, paddingVertical: 12, alignItems: 'center', borderRadius: 4 },
  modalBtnText: { fontFamily: 'SpaceMono', fontSize: 12, letterSpacing: 1, fontWeight: 'bold' },
});
