const Player = require('../Player');
const BasicAttack = require('../../../abilities/common/BasicAttack');
const QuickStrike = require('../../../abilities/common/QuickStrike');
const SwiftSlash = require('../../../abilities/common/SwiftSlash');
const BlitzAssault = require('../../../abilities/common/BlitzAssault');
const Momentum = require('../../../abilities/support/Momentum');
const IronSword = require('../../../items/weapons/IronSword');
const SteelSword = require('../../../items/weapons/SteelSword');
const HealthPotion = require('../../../items/consumables/HealthPotion');
const ManaPotion = require('../../../items/consumables/ManaPotion');

class Vanguard extends Player {
    constructor(nome, genero = 'male') {
        super(nome, 100, 12, 14, 6, 8, genero);
        this.habilidades = [new BasicAttack(), new QuickStrike(), new SwiftSlash(), new BlitzAssault(), new Momentum()];
        this.momentum = 0;
        this.agilidadeOriginal = this.agilidade;
        this.temMomentum = true;
        const espada = new IronSword();
        this.adicionarItem(espada);
        this.equiparArma(espada);
        this.adicionarItem(new SteelSword());
        this.adicionarItem(new HealthPotion());
        this.adicionarItem(new HealthPotion());
        this.adicionarItem(new ManaPotion());
    }

    usarHabilidade(index, alvo) {
        const resultado = super.usarHabilidade(index, alvo);
        if (resultado && resultado.critico && this.temMomentum) Momentum.ganharMomentum(this);
        return resultado;
    }

    receberDano(dano) {
        const danoRecebido = super.receberDano(dano);
        if (this.temMomentum && this.momentum > 0) {
            const danoAlto = this.vidaMax * 0.3;
            if (danoRecebido >= danoAlto) Momentum.perderMomentum(this, Math.ceil(danoRecebido / danoAlto));
        }
        return danoRecebido;
    }
}
module.exports = Vanguard;
