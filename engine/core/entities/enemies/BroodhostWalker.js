const Enemy = require('../Enemy');
const BasicAttack = require('../../../abilities/common/BasicAttack');
const SporeCloud = require('../../../abilities/enemy/SporeCloud');
const HealthPotion = require('../../../items/consumables/HealthPotion');
const MutatedCore = require('../../../items/drops/MutatedCore');

class BroodhostWalker extends Enemy {
    constructor() {
        super("Broodhost Walker", 400, 30, 12, 5, 18, 8);
        this.xpReward = 25;
        this.habilidades = [new BasicAttack(), new SporeCloud()];
        this.lootTable = [{ item: HealthPotion, chance: 0.6 }, { item: MutatedCore, chance: 0.20 }];
    }
}
module.exports = BroodhostWalker;
