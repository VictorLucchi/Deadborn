const AttackAbility = require('../AttackAbility');
class QuickStrike extends AttackAbility {
    constructor(){ super("Quick Strike", 3, "agilidade", 3, 8); this.chanceCritico = 0.30; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        alvo.receberDano(resultado.dano);
        if (resultado.critico) resultado.golpeRapido = true;
        return resultado;
    }
}
module.exports = QuickStrike;
