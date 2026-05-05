const Enemy = require('../Enemy');
const BasicAttack = require('../../../abilities/common/BasicAttack');
const Constriction = require('../../../abilities/enemy/Constriction');
const CorruptBreath = require('../../../abilities/enemy/CorruptBreath');
const HealthPotion = require('../../../items/consumables/HealthPotion');
const ManaPotion = require('../../../items/consumables/ManaPotion');
const AbyssalBlood = require('../../../items/drops/AbyssalBlood');
const MutatedCore = require('../../../items/drops/MutatedCore');

class HostSerpent extends Enemy {
    constructor() {
        super("Host Serpent", 900, 300, 25, 35, 10, 10);
        this.xpReward = 100;
        this.habilidades = [new BasicAttack(), new Constriction(), new CorruptBreath()];
        this.lootTable = [
            { item: HealthPotion, chance: 1.0 }, { item: ManaPotion, chance: 1.0 },
            { item: AbyssalBlood, chance: 0.5 }, { item: MutatedCore, chance: 0.06 }
        ];
    }
}
module.exports = HostSerpent;
