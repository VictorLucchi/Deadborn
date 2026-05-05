class TurnManager {
    constructor(){ this.turnoAtual = 1; }

    iniciarTurno(personagem){
        const efeitos = personagem.processarTurno();
        const mensagens = [];

        efeitos.forEach(efeito => {
            if (efeito.tipo === 'veneno') mensagens.push(`${personagem.nome} sofreu ${efeito.dano} de dano por VENENO!`);
            if (efeito.tipo === 'defesa__expirou') mensagens.push(`O escudo de ${personagem.nome} se quebrou!`);
            if (efeito.tipo === 'marcas_expiraram') mensagens.push(`As marcas em ${personagem.nome} desapareceram!`);
        });

        if (personagem.estaAtordoado()){
            mensagens.push(`${personagem.nome} está ATORDOADO e pulou o turno!`);
            personagem.removerStatus('atordoado');
            return { podeAgir: false, mensagens };
        }

        return { podeAgir: personagem.estaVivo(), mensagens };
    }

    formatarResultado(resultado, atacante, alvo) {
        if (!resultado) return [];
        const msgs = [];
        if (resultado.erro) { msgs.push(resultado.erro); return msgs; }

        if (resultado.dano) {
            let msg = `${atacante.nome} atacou ${alvo.nome} causando ${resultado.dano} de dano!`;
            if (resultado.critico) msg += ' CRÍTICO!';
            if (resultado.golpes) msg += ` (${resultado.golpes} golpes)`;
            if (resultado.ataques) msg += ` (${resultado.ataques} ataques)`;
            if (resultado.penetracao) msg += ` (Ignorou ${resultado.penetracao} de defesa)`;
            msgs.push(msg);
            if (resultado.dreno) msgs.push(`${atacante.nome} drenou ${resultado.dreno} de vida!`);
        } else if (resultado.cura) {
            msgs.push(`${atacante.nome} recuperou ${resultado.cura} de vida!`);
        } else if (resultado.manaRecuperada) {
            msgs.push(`${atacante.nome} recuperou ${resultado.manaRecuperada} de mana!${resultado.critico ? ' CRÍTICO! Mana totalmente restaurada!' : ''}`);
        } else if (resultado.defesaAtivada) {
            msgs.push(`${atacante.nome} ativou a DEFESA por ${resultado.duracao} turnos!`);
        }

        if (resultado.envenenou) msgs.push(`${alvo.nome} foi ENVENENADO!`);
        if (resultado.sangramento) msgs.push(`${alvo.nome} está SANGRANDO! (${resultado.sangramento} dano/turno)`);
        if (resultado.atordoou) msgs.push(`${alvo.nome} ficou ATORDOADO!`);
        if (resultado.marcado) msgs.push(`${alvo.nome} foi MARCADO! (${alvo.quantidadeMarcas} marcas)`);
        if (resultado.marcasConsumidas > 0) msgs.push(`${resultado.marcasConsumidas} marcas foram consumidas!`);
        if (resultado.ignorouDefesa) msgs.push(`Ataque preciso ignorou toda a defesa!`);

        return msgs;
    }

    proximoTurno() { this.turnoAtual++; }
}
module.exports = TurnManager;
