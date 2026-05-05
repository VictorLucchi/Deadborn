const Item = require('../Item');
class AbyssalBlood extends Item {
    constructor(){
        super("Abyssal Blood", "consumivel", "Restaura 20 de vida e fortalece uma habilidade");
        this.cura = 20;
    }
    async usar(usuario, indiceHabilidade = null) {
        const vidaAntes = usuario.vida;
        usuario.curar(this.cura);
        const vidaCurada = usuario.vida - vidaAntes;
        if (indiceHabilidade === null) {
            return { mensagem: `${usuario.nome} bebeu ${this.nome}! Recuperou ${vidaCurada} de vida. Escolha uma habilidade para fortalecer.`, cura: vidaCurada, precisaEscolha: true };
        }
        if (!usuario.habilidadesFortalecidas) usuario.habilidadesFortalecidas = {};
        if (!usuario.habilidadesFortalecidas[indiceHabilidade]) usuario.habilidadesFortalecidas[indiceHabilidade] = 0;
        usuario.habilidadesFortalecidas[indiceHabilidade]++;
        const habilidade = usuario.habilidades[indiceHabilidade];
        const nivel = usuario.habilidadesFortalecidas[indiceHabilidade];
        if (habilidade.custoMana > 0) habilidade.custoMana = Math.max(0, habilidade.custoMana - 1);
        if (habilidade.variacaoMax) { habilidade.variacaoMax += 3; habilidade.variacaoMin += 2; }
        if (habilidade.chanceCritico !== undefined) habilidade.chanceCritico = Math.min(0.60, habilidade.chanceCritico + 0.05);
        usuario.removerItem(this);
        return { mensagem: `${habilidade.nome} foi fortalecida! (Nível ${nivel})`, cura: vidaCurada, habilidadeFortalecida: habilidade.nome, nivel };
    }
}
module.exports = AbyssalBlood;
