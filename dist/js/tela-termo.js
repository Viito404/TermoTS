import { AvaliacaoEnum } from "./avaliacao-enum.js";
import { Termo } from "./termo.js";
class TelaTermo {
    get linhaAtual() {
        return this.linhasTermo[this.termo.rodadas];
    }
    constructor() {
        this.linhasTermo = [];
        this.indiceLetraSelecionada = -1;
        this.configurarElementos();
        this.configurarEventos();
    }
    configurarElementos() {
        this.termo = new Termo();
        this.pnlTeclado = document.getElementById('pnlTeclado');
        document.querySelectorAll('.linha').forEach(div => {
            this.linhasTermo.push(div);
        });
        this.pnlNotificacao = document.getElementById('pnlNotificacao');
        this.btnApagar = document.getElementById('btnApagar');
        this.btnEntrar = document.getElementById('btnEnter');
        this.btnReiniciar = document.getElementById('btnReiniciar');
        this.mensagemResultado = document.getElementById('mensagemResultado');
        this.pnlNotificacao.classList.add("display-none");
    }
    configurarEventos() {
        for (const botao of this.pnlTeclado.children) {
            if (botao.textContent === "ENTER" || botao.textContent === "<")
                continue;
            botao.addEventListener("click", this.selecionarLetra.bind(this));
        }
        this.btnEntrar.addEventListener("click", this.verificarPalavra.bind(this));
        this.btnReiniciar.addEventListener("click", this.recomecarJogo.bind(this));
        this.btnApagar.addEventListener("click", this.apagarLetra.bind(this));
    }
    recomecarJogo(event) {
        this.termo = new Termo();
        for (const linha of this.linhasTermo) {
            for (const coluna of linha.children) {
                coluna.textContent = '';
                coluna.classList.remove("letra-correta");
                coluna.classList.remove("letra-incorreta");
                coluna.classList.remove("letra-inexistente");
            }
        }
        for (const botao of this.pnlTeclado.children)
            botao.disabled = false;
        this.pnlNotificacao.classList.add("display-none");
    }
    selecionarLetra(event) {
        if (this.indiceLetraSelecionada > 3 || this.indiceLetraSelecionada < -1)
            return;
        const letra = event.target.textContent;
        this.indiceLetraSelecionada++;
        const coluna = this.linhaAtual.children[this.indiceLetraSelecionada];
        coluna.textContent = letra;
    }
    apagarLetra() {
        if (this.indiceLetraSelecionada >= 0) {
            const indiceColuna = this.linhaAtual.children[this.indiceLetraSelecionada];
            if (indiceColuna) {
                indiceColuna.textContent = "";
                this.indiceLetraSelecionada--;
            }
        }
    }
    verificarPalavra() {
        const palavra = this.obterPalavra();
        const linhaAtual = this.termo.rodadas;
        const avaliacoes = this.avaliarPalavra(palavra);
        if (avaliacoes === null)
            return;
        const jogadorAcertou = this.termo.jogadorGanhou(palavra);
        const jogadorPerdeu = this.termo.jogadorPerdeu();
        this.modificarCor(linhaAtual, avaliacoes);
        if (jogadorPerdeu) {
            this.mensagemResultado.classList.add("erro");
        }
        else {
            this.mensagemResultado.classList.add("acerto");
        }
        if (jogadorAcertou || jogadorPerdeu) {
            this.mensagemResultado.textContent = this.mensagemFinal;
            for (const botao of this.pnlTeclado.children) {
                if (botao.textContent === "Reiniciar")
                    continue;
                botao.disabled = true;
            }
            this.pnlNotificacao.classList.remove("display-none");
        }
        this.indiceLetraSelecionada = -1;
    }
    modificarCor(linha, avaliacoes) {
        for (let coluna = 0; coluna < avaliacoes.length; coluna++) {
            const divSelecionado = this.linhasTermo[linha].children[coluna];
            switch (avaliacoes[coluna]) {
                case AvaliacaoEnum.Correta:
                    divSelecionado.classList.add("letra-correta");
                    break;
                case AvaliacaoEnum.Incorreta:
                    divSelecionado.classList.add("letra-incorreta");
                    break;
                case AvaliacaoEnum.Inexistente:
                    divSelecionado.classList.add("letra-inexistente");
                    break;
            }
        }
    }
    avaliarPalavra(palavra) {
        if (palavra.length !== 5)
            return null;
        this.termo.rodadas++;
        const avaliacoes = new Array(palavra.length);
        for (let i = 0; i < palavra.length; i++) {
            if (palavra[i] === this.termo.palavraSecreta[i])
                avaliacoes[i] = AvaliacaoEnum.Correta;
            else if (this.termo.palavraSecretaSemAcento.includes(palavra[i]))
                avaliacoes[i] = AvaliacaoEnum.Incorreta;
            else
                avaliacoes[i] = AvaliacaoEnum.Inexistente;
        }
        if (avaliacoes.every(a => a === AvaliacaoEnum.Correta)) {
            this.mensagemFinal = `Parabéns!, você acertou a palavra ${this.termo.palavraSecreta}`;
        }
        else if (this.termo.jogadorPerdeu()) {
            this.mensagemFinal = `Que pena!, a palavra era ${this.termo.palavraSecreta}`;
        }
        return avaliacoes;
    }
    obterPalavra() {
        let palavra = '';
        for (let coluna = 0; coluna < 5; coluna++) {
            palavra += this.linhaAtual.children[coluna].innerText;
        }
        return palavra;
    }
}
window.addEventListener('load', () => new TelaTermo());
//# sourceMappingURL=tela-termo.js.map