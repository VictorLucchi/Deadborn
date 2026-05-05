class LootSystem {
    static gerarLoot(tabelaLoot) {
        return tabelaLoot
            .filter(entrada => Math.random() <= entrada.chance)
            .map(entrada => new entrada.item());
    }
    static distribuirLoot(itens, jogadores) {
        itens.forEach(item => jogadores[0].adicionarItem(item));
        return itens;
    }
}
module.exports = LootSystem;
