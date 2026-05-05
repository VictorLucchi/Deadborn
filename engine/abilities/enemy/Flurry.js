const AttackAbility = require('../AttackAbility');
class Flurry extends AttackAbility {
    constructor(){ super("Flurry", 7, "agilidade", 3, 6); this.chanceCritico = 0.15; }
    executar(usuario, alvo) {
        const n = Math.min(Math.floor(usuario.agilidade / 6) + 2, 5);
        let danoTotal = 0, critico = false;
        for (let i = 0; i < n; i++) { const r = this.rolarDano(usuario); danoTotal += r.dano; if (r.critico) critico = true; }
        alvo.receberDano(danoTotal);
        return { dano: danoTotal, critico, ataques: n };
    }
}
module.exports = Flurry;
