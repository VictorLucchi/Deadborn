const AttackAbility = require('../AttackAbility');
class CorruptBreath extends AttackAbility {
    constructor(){ super("Corrupt Breath", 8, "controle", 10, 20); this.chanceCritico = 0.15; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        alvo.receberDano(resultado.dano);
        alvo.envenenar(Math.floor(Math.random() * 5) + 3);
        resultado.envenenou = true;
        return resultado;
    }
}
module.exports = CorruptBreath;
