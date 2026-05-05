const Enemy = require('../Enemy');
const BasicAttack = require('../../../abilities/common/BasicAttack');
const Flurry = require('../../../abilities/enemy/Flurry');
const Lunge = require('../../../abilities/enemy/Lunge');
const HealthPotion = require('../../../items/consumables/HealthPotion');

class Goblin extends Enemy {
    constructor() {
        super("Goblin", 150, 20, 8, 12, 8, 4);
        this.xpReward = 10;
        this.habilidades = [new BasicAttack(), new Flurry(), new Lunge()];
        this.lootTable = [{ item: HealthPotion, chance: 0.4 }];
    }
}
module.exports = Goblin;
