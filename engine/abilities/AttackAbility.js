const Ability = require('./Ability');

class AttackAbility extends Ability {
    constructor(nome, custoMana, atributoEscalonamento, variacaoMin = 1, variacaoMax = 5) {
        super(nome, custoMana);
        this.atributoEscalonamento = atributoEscalonamento;
        this.variacaoMin = variacaoMin;
        this.variacaoMax = variacaoMax;
        this.chanceCritico = 0.15;
    }

    rolarDano(usuario) {
        const valorAtributo = usuario[this.atributoEscalonamento] || 0;
        const danoArma = usuario.getDanoArma ? usuario.getDanoArma() : 0;
        const danoAleatorio = Math.floor(Math.random() * (this.variacaoMax - this.variacaoMin + 1)) + this.variacaoMin;
        let danoTotal = valorAtributo + danoArma + danoAleatorio;
        let critico = Math.random() < this.chanceCritico;
        if (critico) danoTotal = Math.floor(danoTotal * 1.5);
        return { dano: danoTotal, critico };
    }

    executar(usuario, alvo) { throw new Error("Metodo executar() deve ser implementado."); }
}

module.exports = AttackAbility;
