class Character {
    constructor(nome, vidaMax, manaMax = 0, forca = 0, agilidade = 0, vigor = 0, controle = 0){
        this.nome = nome;
        this.vidaMax = vigor * 5 + 30;
        this.vida = this.vidaMax;
        this.manaMax = controle * 2 + 15;
        this.mana = this.manaMax;
        this.forca = forca;
        this.agilidade = agilidade;
        this.vigor = vigor;
        this.controle = controle;
        this.status = {
            marcado: false, atordoado: false, defendendo: false,
            envenenado: false, sangrando: false, queimado: false,
            congelado: false, agarrado: false
        };
        this.turnosDefesa = 0;
        this.danoVeneno = 0;
        this.quantidadeMarcas = 0;
        this.habilidades = [];
        this.armaEquipada = null;
        this.inventario = [];
    }

    estaVivo() { return this.vida > 0; }

    ativarDefesa(turnos = 1){
        this.status.defendendo = true;
        this.turnosDefesa = turnos;
    }

    receberDano(dano){
        dano = Math.max(dano - this.vigor, 0);
        if(this.status.defendendo) dano = Math.floor(dano / 2);
        if (this.status.marcado) {
            dano = dano - 5 + (this.quantidadeMarcas * 5);
            if (dano < 0) dano = 0;
        }
        this.vida -= dano;
        if (this.vida < 0) this.vida = 0;
        return dano;
    }

    curar(valor){ this.vida = Math.min(this.vida + valor, this.vidaMax); }
    recuperarMana(valor) { this.mana = Math.min(this.mana + valor, this.manaMax); }
    aplicarStatus(tipo){ this.status[tipo] = true; }
    removerStatus(tipo){ this.status[tipo] = false; }

    aplicarMarcas(quantidade = 1){
        this.status.marcado = true;
        this.quantidadeMarcas += quantidade;
    }
    removerMarcas(){
        this.status.marcado = false;
        this.quantidadeMarcas = 0;
    }

    estaAtordoado() { return this.status.atordoado === true; }
    atordoar() { this.aplicarStatus('atordoado'); }
    envenenar(dano) { this.status.envenenado = true; this.danoVeneno = dano; }

    processarTurno(){
        let efeitos = [];
        if(this.status.envenenado) {
            this.vida -= this.danoVeneno;
            if(this.vida < 0) this.vida = 0;
            efeitos.push({ tipo: 'veneno', dano: this.danoVeneno});
        }
        if (this.status.defendendo && this.turnosDefesa > 0) {
            this.turnosDefesa--;
            if (this.turnosDefesa === 0) {
                this.status.defendendo = false;
                efeitos.push({ tipo: 'defesa__expirou'});
            }
        }
        if (this.status.marcado){
            this.quantidadeMarcas--;
            efeitos.push({ tipo: 'marca_decaiu'});
            if (this.quantidadeMarcas <= 0) {
                this.removerMarcas();
                efeitos.push({ tipo: 'marcas_expiraram'});
            }
        }
        if (this.momentum && this.momentum > 0) {
            // momentum é processado pelo Vanguard via ganharMomentum/perderMomentum
        }
        return efeitos;
    }

    usarHabilidade(index, alvo) {
        const habilidade = this.habilidades[index];
        if (!habilidade) return { erro: "Habilidade inválida." };
        if (!habilidade.podeUsar(this)) return { erro: "Mana insuficiente" };
        if(habilidade.custoMana > 0) this.mana -= habilidade.custoMana;
        return habilidade.executar(this, alvo);
    }

    equiparArma(arma) {
        if (this.armaEquipada) this.adicionarItem(this.armaEquipada);
        this.armaEquipada = arma;
        this.removerItem(arma);
    }

    desequiparArma() {
        if (this.armaEquipada) {
            this.adicionarItem(this.armaEquipada);
            this.armaEquipada = null;
        }
    }

    getDanoArma() { return this.armaEquipada ? this.armaEquipada.danoAtaque : 0; }
    adicionarItem(item) { this.inventario.push(item); }
    removerItem(item) {
        const index = this.inventario.indexOf(item);
        if (index > -1) this.inventario.splice(index, 1);
    }
}

module.exports = Character;
