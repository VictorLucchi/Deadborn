const AttackAbility = require('../AttackAbility');
class ShadowStep extends AttackAbility {
    constructor(){ super("Shadow Step", 6, "agilidade", 8, 15); this.chanceCritico = 0.25; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        const penetracao = Math.floor(usuario.agilidade * 0.3);
        const defesaOriginal = alvo.vigor;
        alvo.vigor = Math.max(0, alvo.vigor - penetracao);
        alvo.receberDano(resultado.dano);
        alvo.vigor = defesaOriginal;
        resultado.penetracao = penetracao;
        return resultado;
    }
}
module.exports = ShadowStep;
