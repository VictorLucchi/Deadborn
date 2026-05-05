const Item = require('../Item');
class MutatedCore extends Item {
    constructor(){
        super("Mutated Core", "material", "Núcleo mutante. Evolui uma habilidade permanentemente");
    }
    async usar(usuario, indiceHabilidade = null) {
        if (indiceHabilidade === null) {
            return { mensagem: `O núcleo pulsa com energia estranha. Escolha uma habilidade para evoluir.`, precisaEscolha: true };
        }
        if (!usuario.habilidadesEvoluidas) usuario.habilidadesEvoluidas = {};
        if (!usuario.habilidadesEvoluidas[indiceHabilidade]) usuario.habilidadesEvoluidas[indiceHabilidade] = 0;
        usuario.habilidadesEvoluidas[indiceHabilidade]++;
        const habilidade = usuario.habilidades[indiceHabilidade];
        const nivel = usuario.habilidadesEvoluidas[indiceHabilidade];
        if (habilidade.custoMana > 0) habilidade.custoMana = Math.max(0, habilidade.custoMana - 2);
        if (habilidade.variacaoMax) { habilidade.variacaoMax += 5; habilidade.variacaoMin += 3; }
        if (habilidade.chanceCritico !== undefined) habilidade.chanceCritico = Math.min(0.60, habilidade.chanceCritico + 0.08);
        habilidade.evoluida = true;
        usuario.removerItem(this);
        return { mensagem: `${habilidade.nome} EVOLUIU! (Evolução ${nivel})`, habilidadeEvoluida: habilidade.nome, nivelEvolucao: nivel };
    }
}
module.exports = MutatedCore;
