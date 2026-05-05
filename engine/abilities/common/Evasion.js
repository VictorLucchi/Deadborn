const Ability = require('../Ability');
class Evasion extends Ability {
    constructor(){ super("Evasion", 4); }
    executar(usuario, alvo) {
        const duracao = Math.min(Math.floor(usuario.agilidade / 8) + 2, 5);
        usuario.ativarDefesa(duracao);
        return { defesaAtivada: true, duracao };
    }
}
module.exports = Evasion;
