class Item {
    constructor(nome, tipo = "consumivel", descricao = ""){
        this.nome = nome;
        this.tipo = tipo;
        this.descricao = descricao;
    }
    async usar(usuario) {
        return { mensagem: `${usuario.nome} usou ${this.nome}.` };
    }
}
module.exports = Item;
