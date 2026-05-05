const Item = require('./Item');
class Equipment extends Item {
    constructor(nome, descricao = "", slot, danoAtaque = 0, bonusDefesa = 0){
        super(nome, "equipamento", descricao);
        this.slot = slot;
        this.danoAtaque = danoAtaque;
        this.bonusDefesa = bonusDefesa;
    }
}
module.exports = Equipment;
