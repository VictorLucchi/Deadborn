const AttackAbility = require('../AttackAbility');
class SporeCloud extends AttackAbility {
    constructor(){ super("Spore Cloud", 10, "controle", 8, 15); this.chanceCritico = 0.05; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        alvo.receberDano(resultado.dano);
        if (Math.random() < 0.40) {
            alvo.envenenar(Math.floor(Math.random() * 3) + 2);
            alvo.aplicarMarcas(2);
            resultado.envenenou = true;
            resultado.marcado = true;
        }
        return resultado;
    }
}
module.exports = SporeCloud;
