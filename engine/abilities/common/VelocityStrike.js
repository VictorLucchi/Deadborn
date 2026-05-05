const AttackAbility = require('../AttackAbility');
class VelocityStrike extends AttackAbility {
    constructor(){ super("Velocity Strike", 7, "agilidade", 6, 12); this.chanceCritico = 0.18; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        const diff = usuario.agilidade - (alvo.agilidade || 5);
        if (diff > 0) { resultado.dano += Math.floor(diff * 0.8); resultado.bonusVelocidade = Math.floor(diff * 0.8); }
        alvo.receberDano(resultado.dano);
        return resultado;
    }
}
module.exports = VelocityStrike;
