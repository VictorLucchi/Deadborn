const Player = require('../Player');
const BreakerSlash = require('../../../abilities/player/confident/breaker/BreakerSlash');
const BreakerFinisher = require('../../../abilities/player/confident/breaker/BreakerFinisher');
const BasicAttack = require('../../../abilities/common/BasicAttack');
const Rest = require('../../../abilities/support/Rest');
const IronSword = require('../../../items/weapons/IronSword');
const SteelSword = require('../../../items/weapons/SteelSword');
const HealthPotion = require('../../../items/consumables/HealthPotion');
const ManaPotion = require('../../../items/consumables/ManaPotion');
const AbyssalBlood = require('../../../items/drops/AbyssalBlood');
const MutatedCore = require('../../../items/drops/MutatedCore');

class Confident extends Player {
    constructor(nome, genero = 'male') {
        super(nome, 100, 14, 7, 14, 5, genero);
        this.habilidades = [new BasicAttack(), new BreakerSlash(), new BreakerFinisher(), new Rest()];
        const espada = new IronSword();
        this.adicionarItem(espada);
        this.equiparArma(espada);
        this.adicionarItem(new SteelSword());
        this.adicionarItem(new HealthPotion());
        this.adicionarItem(new HealthPotion());
        this.adicionarItem(new ManaPotion());
        this.adicionarItem(new AbyssalBlood());
        this.adicionarItem(new MutatedCore());
    }
}
module.exports = Confident;
