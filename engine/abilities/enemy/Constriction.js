const AttackAbility = require('../AttackAbility');
class Constriction extends AttackAbility {
    constructor(){ super("Constriction", 4, "forca", 8, 18); this.chanceCritico = 0.10; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        alvo.receberDano(resultado.dano);
        if (Math.random() < 0.30) resultado.constricted = true;
        return resultado;
    }
}
module.exports = Constriction;
