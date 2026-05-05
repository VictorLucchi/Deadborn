const Character = require('../Character');

class Player extends Character {
    constructor(nome, vidaMax, forca, agilidade, vigor, controle, habilidadesIniciais = []) {
        super(nome, 0, 0, forca, agilidade, vigor, controle);
        this.xp = 0;
        this.nivel = 1;
        this.habilidades = habilidadesIniciais;
        this.habilidadesFortalecidas = {};
        this.habilidadesEvoluidas = {};
    }

    recuperarMana(valor) { this.mana = Math.min(this.mana + valor, this.manaMax); }

    ganharXp(valor) {
        this.xp += valor;
        if (this.xp >= 30) { this.subirNivel(); return { levelUp: true }; }
        return { levelUp: false };
    }

    subirNivel(){
        this.nivel++;
        this.xp = 0;
        this.vidaMax += 20;
        this.vida = this.vidaMax;
        this.manaMax += 5;
        this.mana = this.manaMax;
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
