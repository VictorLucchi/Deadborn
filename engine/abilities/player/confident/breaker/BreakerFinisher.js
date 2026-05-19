const AttackAbility = require('../../../AttackAbility');
class BreakerFinisher extends AttackAbility {
    constructor(){ super("Breaker Finisher", 8, "forca", 5, 5); this.chanceCritico = 0.15; }
    executar(usuario, alvo) {
        // Agora consome marcas do USUÁRIO
        const marcas = usuario.quantidadeMarcas || 0;
        let danoTotal = Math.floor((5 + usuario.forca) * (1 + marcas * 0.40));
        const critico = Math.random() < this.chanceCritico;
        if (critico) danoTotal = Math.floor(danoTotal * 1.5);
        alvo.receberDano(danoTotal);
        if (marcas > 0) usuario.removerMarcas();
        return { dano: danoTotal, critico, marcasConsumidas: marcas };
    }
}
module.exports = BreakerFinisher;
