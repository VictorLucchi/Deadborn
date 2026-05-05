const AttackAbility = require('../../../AttackAbility');
class BreakerSlash extends AttackAbility {
    constructor(){ super("Breaker Slash", 6, "forca", 5, 15); this.chanceCritico = 0.2; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        alvo.receberDano(resultado.dano);
        if (resultado.critico) { alvo.aplicarMarcas(3); resultado.marcado = true; }
        return resultado;
    }
}
module.exports = BreakerSlash;
