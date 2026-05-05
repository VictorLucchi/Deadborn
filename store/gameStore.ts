import { create } from 'zustand';
const { criarPersonagem } = require('../engine/GameEngine');

interface GameStore {
  jogador: any | null;
  setJogador: (nome: string, classeId: string) => void;
  resetJogador: () => void;
  restaurarJogador: () => void;
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
}));
