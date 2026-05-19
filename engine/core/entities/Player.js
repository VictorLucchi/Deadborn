const Character = require('../Character');

class Player extends Character {
    constructor(nome, vidaMax, forca, agilidade, vigor, controle, habilidadesIniciais = []) {
        super(nome, 0, 0, forca, agilidade, vigor, controle);
        this.xp = 0;
        this.nivel = 1;
        this.pontosDisponiveis = 0;
        this.habilidades = habilidadesIniciais;
        this.habilidadesFortalecidas = {};
        this.habilidadesEvoluidas = {};
    }

    // XP necessário para o próximo nível (curva progressiva)
    getXpNecessario() {
        return 30 + (this.nivel - 1) * 20; // Ex: Nv1: 30, Nv2: 50, Nv3: 70...
    }

    recuperarMana(valor) { this.mana = Math.min(this.mana + valor, this.manaMax); }

    ganharXp(valor) {
        this.xp += valor;
        const xpNecessario = this.getXpNecessario();
        if (this.xp >= xpNecessario) { 
            this.subirNivel(); 
            return { levelUp: true }; 
        }
        return { levelUp: false };
    }

    subirNivel(){
        this.nivel++;
        this.xp = 0;
        this.vidaMax += 20;
        this.vida = this.vidaMax;
        this.manaMax += 5;
        this.mana = this.manaMax;
        this.pontosDisponiveis += 3;
    }

    distribuirPonto(stat) {
        if (this.pontosDisponiveis <= 0) return false;
        const validos = ['forca', 'agilidade', 'vigor', 'controle'];
        if (!validos.includes(stat)) return false;
        this[stat]++;
        if (stat === 'vigor') { this.vidaMax += 5; this.vida = Math.min(this.vida + 5, this.vidaMax); }
        if (stat === 'controle') { this.manaMax += 2; this.mana = Math.min(this.mana + 2, this.manaMax); }
        this.pontosDisponiveis--;
        return true;
    }

    listarHabilidades(){
        return this.habilidades.map((habilidade, index) => ({
            index,
            nome: habilidade.nome,
            custoMana: habilidade.custoMana
        }));
    }
}

module.exports = Player;
