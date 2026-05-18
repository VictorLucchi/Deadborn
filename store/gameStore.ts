import { create } from 'zustand';
const { criarPersonagem } = require('../engine/GameEngine');

interface GameStore {
  jogador: any | null;
  setJogador: (nome: string, classeId: string) => void;
  resetJogador: () => void;
  restaurarJogador: () => void;
  distribuirPonto: (stat: string) => void;
  equiparArma: (arma: any) => void;
  usarItem: (item: any) => Promise<string | null>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  jogador: null,
  setJogador: (nome, classeId) => set({ jogador: criarPersonagem(nome, classeId) }),
  resetJogador: () => set({ jogador: null }),
  restaurarJogador: () => {
    const jogador = get().jogador;
    if (!jogador) return;
    const xpAtual = jogador.xp;
    const nivelAtual = jogador.nivel;
    jogador.vida = jogador.vidaMax;
    jogador.mana = jogador.manaMax;
    jogador.xp = xpAtual;
    jogador.nivel = nivelAtual;
    jogador.status = {
      marcado: false, atordoado: false, defendendo: false,
      envenenado: false, sangrando: false, queimado: false,
      congelado: false, agarrado: false
    };
    jogador.danoVeneno = 0;
    jogador.quantidadeMarcas = 0;
    jogador.turnosDefesa = 0;
    set({ jogador });
  },
  distribuirPonto: (stat: string) => {
    const jogador = get().jogador;
    if (!jogador) return;
    jogador.distribuirPonto(stat);
    set({ jogador });
  },
  equiparArma: (arma: any) => {
    const jogador = get().jogador;
    if (!jogador) return;
    jogador.equiparArma(arma);
    set({ jogador });
  },
  usarItem: async (item: any) => {
    const jogador = get().jogador;
    if (!jogador) return null;
    const resultado = await item.usar(jogador);
    set({ jogador });
    return resultado?.mensagem ?? null;
  },
}));
