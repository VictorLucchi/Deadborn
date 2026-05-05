class Ability {
    constructor(nome, custoMana = 0){
        this.nome = nome;
        this.custoMana = custoMana;
    }
    podeUsar(usuario) { return usuario.mana >= this.custoMana; }
    executar(usuario, alvo){ throw new Error("Metodo executar() deve ser implementado."); }
}

module.exports = Ability;
