const Enemy = require('../Enemy');
const BasicAttack = require('../../../abilities/common/BasicAttack');
const HealthPotion = require('../../../items/consumables/HealthPotion');

class ParasiticConclave extends Enemy {
    constructor() {
        super("Parasitic Conclave", 300, 150, 10, 10, 10, 10);
        this.xpReward = 15;
        this.habilidades = [new BasicAttack()];
        this.lootTable = [{ item: HealthPotion, chance: 0.8 }];
    }
}
module.exports = ParasiticConclave;
