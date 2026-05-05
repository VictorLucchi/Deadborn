const AttackAbility = require('../AttackAbility');
class ParasiticGrasp extends AttackAbility {
    constructor(){ super("Parasitic Grasp", 6, "controle", 5, 12); this.chanceCritico = 0.20; }
    executar(usuario, alvo) {
        const resultado = this.rolarDano(usuario);
        const danoReal = alvo.receberDano(resultado.dano);
        const cura = Math.floor(danoReal * 0.5);
        usuario.curar(cura);
        resultado.dreno = cura;
        return resultado;
    }
}
module.exports = ParasiticGrasp;
