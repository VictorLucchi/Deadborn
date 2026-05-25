const TurnManager = require('./combate/TurnManager');
const LootSystem = require('./systems/LootSystem');
const Goblin = require('./core/entities/enemies/Goblin');
const Hunter = require('./core/entities/enemies/Hunter');
const HostSerpent = require('./core/entities/enemies/HostSerpent');
const BroodhostWalker = require('./core/entities/enemies/BroodhostWalker');
const Confident = require('./core/entities/classes/Confident');
const Vanguard = require('./core/entities/classes/Vanguard');

function criarPersonagem(nome, classeId, genero = 'male') {
    if (classeId === '1') return new Confident(nome, genero);
    return new Vanguard(nome, genero);
}

function criarInimigo(dificuldade) {
    switch(dificuldade) {
        case 1: return new Goblin();
        case 2: return new BroodhostWalker();
        case 3: return new Hunter();
        case 4: return new HostSerpent();
        default: return new Goblin();
    }
}

class GameEngine {
    constructor(onLog) {
        this.onLog = onLog || (() => {});
        this.turnManager = new TurnManager();
        this.jogadores = [];
        this.inimigo = null;
        this.modo = null;
        this.turnoAtual = 'jogador';
        this.indiceJogadorAtual = 0;
        this.emAndamento = false;
    }

    log(msg) { this.onLog(msg); }

    iniciarPvE(jogadorPrincipal, jogadorSecundario, dificuldade) {
        this.inimigo = criarInimigo(dificuldade);
        this.jogadores = jogadorSecundario ? [jogadorPrincipal, jogadorSecundario] : [jogadorPrincipal];
        this.modo = 'pve';
        this.emAndamento = true;
        this.indiceJogadorAtual = 0;
        this.turnoAtual = 'jogador';
        this.log(`Combate iniciado! ${jogadorPrincipal.nome} vs ${this.inimigo.nome}`);
        return this.getEstado();
    }

    iniciarPvP(jogador1, jogador2) {
        this.jogadores = [jogador1, jogador2];
        this.inimigo = null;
        this.modo = 'pvp';
        this.emAndamento = true;
        this.indiceJogadorAtual = 0;
        this.turnoAtual = 'jogador';
        this.log(`Arena PvP: ${jogador1.nome} vs ${jogador2.nome}`);
        return this.getEstado();
    }

    getJogadorAtual() {
        return this.jogadores[this.indiceJogadorAtual];
    }

    getAlvoAtual() {
        if (this.modo === 'pve') return this.inimigo;
        return this.jogadores[this.indiceJogadorAtual === 0 ? 1 : 0];
    }

    executarAcaoJogador(tipoAcao, indice = 0) {
        const jogador = this.getJogadorAtual();
        const alvo = this.getAlvoAtual();
        const msgs = [];

        const statusInicio = this.turnManager.iniciarTurno(jogador);
        statusInicio.mensagens.forEach(m => msgs.push(m));

        if (!statusInicio.podeAgir) {
            this._avancarTurno(msgs);
            return { msgs, estado: this.getEstado() };
        }

        if (tipoAcao === 'habilidade') {
            const resultado = jogador.usarHabilidade(indice, alvo);
            this.turnManager.formatarResultado(resultado, jogador, alvo).forEach(m => msgs.push(m));
            if (resultado?.erro) return { msgs, estado: this.getEstado() };
        } else if (tipoAcao === 'item') {
            const consumiveis = this._getConsumiveis(jogador);
            const item = consumiveis[indice];
            if (item) {
                const resultado = item.usar(jogador);
                if (resultado?.then) {
                    return resultado.then(r => {
                        if (r.mensagem) msgs.push(r.mensagem);
                        this._avancarTurno(msgs);
                        return { msgs, estado: this.getEstado() };
                    });
                }
                if (resultado?.mensagem) msgs.push(resultado.mensagem);
            }
        } else if (tipoAcao === 'fugir') {
            this.emAndamento = false;
            msgs.push('Você fugiu do combate...');
            return { msgs, estado: this.getEstado(), fugiu: true };
        }

        this._avancarTurno(msgs);
        return { msgs, estado: this.getEstado() };
    }

    _avancarTurno(msgs) {
        if (!this._verificarFimCombate(msgs)) {
            if (this.modo === 'pve') {
                this._turnoInimigo(msgs);
            } else {
                this.indiceJogadorAtual = this.indiceJogadorAtual === 0 ? 1 : 0;
            }
            this.turnManager.proximoTurno();
            this._verificarFimCombate(msgs);
        }
    }

    _turnoInimigo(msgs) {
        const statusInimigo = this.turnManager.iniciarTurno(this.inimigo);
        statusInimigo.mensagens.forEach(m => msgs.push(m));

        if (statusInimigo.podeAgir) {
            const alvo = this.inimigo.escolherAlvo(this.jogadores);
            if (alvo) {
                const indiceAcao = this.inimigo.escolherAcao();
                const res = this.inimigo.usarHabilidade(indiceAcao, alvo);
                this.turnManager.formatarResultado(res, this.inimigo, alvo).forEach(m => msgs.push(m));
            }
        }

        if (this.jogadores.length > 1) {
            this.indiceJogadorAtual = (this.indiceJogadorAtual + 1) % this.jogadores.length;
        }
    }

    _verificarFimCombate(msgs) {
        if (this.modo === 'pve') {
            if (!this.inimigo.estaVivo()) {
                this.emAndamento = false;
                msgs.push(`${this.inimigo.nome} foi derrotado!`);
                this.jogadores.forEach(j => { if (j.estaVivo()) j.ganharXp(this.inimigo.xpReward); });
                const loot = LootSystem.gerarLoot(this.inimigo.lootTable);
                LootSystem.distribuirLoot(loot, this.jogadores);
                if (loot.length > 0) msgs.push(`Itens obtidos: ${loot.map(i => i.nome).join(', ')}`);
                return true;
            }
            if (!this.jogadores.some(j => j.estaVivo())) {
                this.emAndamento = false;
                msgs.push('O grupo foi aniquilado...');
                return true;
            }
        } else if (this.modo === 'pvp') {
            const vivo = this.jogadores.find(j => j.estaVivo());
            const morto = this.jogadores.find(j => !j.estaVivo());
            if (morto) {
                this.emAndamento = false;
                msgs.push(`${vivo.nome} venceu a Arena!`);
                return true;
            }
        }
        return false;
    }

    _getConsumiveis(jogador) {
        return jogador.inventario.filter(i => i.tipo === 'consumivel' || i.tipo === 'material');
    }

    getConsumiveis(jogador) {
        const agrupados = {};
        this._getConsumiveis(jogador).forEach(item => {
            if (!agrupados[item.nome]) agrupados[item.nome] = { item, quantidade: 0 };
            agrupados[item.nome].quantidade++;
        });
        return Object.values(agrupados);
    }

    getArmas(jogador) {
        return jogador.inventario.filter(i => i.slot === 'arma');
    }

    getEstado() {
        return {
            emAndamento: this.emAndamento,
            modo: this.modo,
            jogadores: this.jogadores,
            inimigo: this.inimigo,
            jogadorAtual: this.getJogadorAtual(),
            turno: this.turnManager.turnoAtual,
        };
    }
}

module.exports = { GameEngine, criarPersonagem, criarInimigo };
