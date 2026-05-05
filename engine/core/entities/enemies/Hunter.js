const Enemy = require('../Enemy');
const BasicAttack = require('../../../abilities/common/BasicAttack');
const ExhaleDecay = require('../../../abilities/enemy/ExhaleDecay');
const ParasiticGrasp = require('../../../abilities/enemy/ParasiticGrasp');
const Eviscerate = require('../../../abilities/enemy/Eviscerate');
const HealthPotion = require('../../../items/consumables/HealthPotion');
const ManaPotion = require('../../../items/consumables/ManaPotion');

class Hunter extends Enemy {
    constructor() {
        super("Hunter", 200, 50, 15, 8, 15, 6);
        this.xpReward = 30;
        this.habilidades = [new BasicAttack(), new ExhaleDecay(), new ParasiticGrasp(), new Eviscerate()];
        this.lootTable = [{ item: HealthPotion, chance: 0.7 }, { item: ManaPotion, chance: 0.5 }];
    }
}
module.exports = Hunter;
