const Ability = require('../Ability');
class Heal extends Ability {
    constructor(){ super("cura", 5); }
    executar(usuario){
        if (usuario.vida === usuario.vidaMax) return { erro: "vida ja esta cheia" };
        usuario.curar(20);
        return { cura: 20 };
    }
}
module.exports = Heal;
