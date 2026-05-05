const AttackAbility = require('../AttackAbility');
class Eviscerate extends AttackAbility {
    constructor(){ super("Eviscerate", 8, "agilidade", 10, 18); this.chanceCritico = 0.25; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        const defesaOriginal = alvo.vigor;
        alvo.vigor = 0;
        alvo.receberDano(resultado.dano);
        alvo.vigor = defesaOriginal;
        alvo.envenenar(Math.floor(usuario.agilidade * 0.4) + 3);
        resultado.sangramento = Math.floor(usuario.agilidade * 0.4) + 3;
        resultado.ignorouDefesa = true;
        return resultado;
    }
}
module.exports = Eviscerate;
