const AttackAbility = require('../AttackAbility');
class BlitzAssault extends AttackAbility {
    constructor(){ super("Blitz Assault", 8, "agilidade", 10, 25); this.chanceCritico = 0.10; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        resultado.dano += Math.floor(usuario.agilidade * 0.5);
        alvo.receberDano(resultado.dano);
        return resultado;
    }
}
module.exports = BlitzAssault;
