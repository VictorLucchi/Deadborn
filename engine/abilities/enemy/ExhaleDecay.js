const AttackAbility = require('../AttackAbility');
class ExhaleDecay extends AttackAbility {
    constructor(){ super("Exhale Decay", 6, "controle", 5, 15); }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        alvo.receberDano(resultado.dano);
        if (resultado.critico) { alvo.envenenar(Math.floor(Math.random() * 4) + 2); resultado.envenenou = true; }
        return resultado;
    }
}
module.exports = ExhaleDecay;
