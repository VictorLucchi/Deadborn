const AttackAbility = require('../AttackAbility');
class Lunge extends AttackAbility {
    constructor(){ super("Lunge", 6, "agilidade", 8, 15); this.chanceCritico = 0.18; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        const diff = usuario.agilidade - (alvo.agilidade || 5);
        if (diff > 0) { resultado.dano += Math.floor(diff * 1.2); resultado.bonusVelocidade = Math.floor(diff * 1.2); if (diff > 15) { alvo.atordoar(); resultado.atordoou = true; } }
        alvo.receberDano(resultado.dano);
        return resultado;
    }
}
module.exports = Lunge;
