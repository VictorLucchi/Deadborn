const AttackAbility = require('../AttackAbility');

class BasicAttack extends AttackAbility {
    constructor(){ super("Ataque Basico", 0, "forca", 5, 10); }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        alvo.receberDano(resultado.dano);
        if (resultado.critico) { alvo.aplicarStatus('atordoado'); resultado.atordoou = true; }
        return resultado;
    }
}
module.exports = BasicAttack;
