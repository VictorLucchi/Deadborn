const Ability = require('../Ability');
class ManaRestore extends Ability {
    constructor(){ super("Prayer", 0); this.chanceCritico = 0.12; }
    executar(usuario) {
        if (usuario.mana === usuario.manaMax) return { erro: "Mana já está cheia" };
        const critico = Math.random() < this.chanceCritico;
        const valorRecuperacao = critico ? usuario.manaMax - usuario.mana : Math.floor(Math.random() * 11) + 10;
        usuario.recuperarMana(valorRecuperacao);
        return { manaRecuperada: valorRecuperacao, critico };
    }
}
module.exports = ManaRestore;
