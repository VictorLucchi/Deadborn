const Ability = require('../Ability');
class Momentum extends Ability {
    constructor(){ super("Momentum", 0); this.passiva = true; }
    executar(usuario, alvo) { return { erro: "Momentum é uma habilidade passiva" }; }

    static ganharMomentum(usuario) {
        if (!usuario.momentum) { usuario.momentum = 0; usuario.agilidadeOriginal = usuario.agilidade; }
        usuario.momentum++;
        usuario.agilidade += 3;
        return { momentumGanho: true, stacks: usuario.momentum };
    }

    static perderMomentum(usuario, stacks = 1) {
        if (!usuario.momentum || usuario.momentum === 0) return null;
        usuario.momentum = Math.max(0, usuario.momentum - stacks);
        usuario.agilidade = usuario.agilidadeOriginal + (usuario.momentum * 3);
        return usuario.momentum === 0 ? { momentumPerdido: true } : { momentumDecaiu: true, stacks: usuario.momentum };
    }

    static resetarMomentum(usuario) {
        if (usuario.momentum && usuario.momentum > 0) {
            usuario.agilidade = usuario.agilidadeOriginal;
            usuario.momentum = 0;
        }
    }
}
module.exports = Momentum;
