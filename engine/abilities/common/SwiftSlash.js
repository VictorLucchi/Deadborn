const AttackAbility = require('../AttackAbility');
class SwiftSlash extends AttackAbility {
    constructor(){ super("Swift Slash", 5, "agilidade", 4, 6); this.chanceCritico = 0.20; }
    executar(usuario, alvo) {
        const numeroGolpes = Math.min(Math.floor(usuario.agilidade / 5) + 1, 4);
        let danoTotal = 0, critico = false;
        for (let i = 0; i < numeroGolpes; i++) {
            const r = this.rolarDano(usuario);
            danoTotal += r.dano;
            if (r.critico) critico = true;
        }
        alvo.receberDano(danoTotal);
        return { dano: danoTotal, critico, golpes: numeroGolpes };
    }
}
module.exports = SwiftSlash;
