const Item = require('../Item');
class HealthPotion extends Item {
    constructor(){ super("Poção de Vida", "consumivel", "Restaura 50 de vida"); this.cura = 50; }
    async usar(usuario) {
        const vidaAntes = usuario.vida;
        usuario.curar(this.cura);
        const vidaCurada = usuario.vida - vidaAntes;
        usuario.removerItem(this);
        return { mensagem: `${usuario.nome} usou ${this.nome} e recuperou ${vidaCurada} de vida!`, cura: vidaCurada };
    }
}
module.exports = HealthPotion;
