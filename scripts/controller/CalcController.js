//Utilizando o paradigma da Programação Orientada a Objetos
class CalcController {

    constructor() {

        this._ultimoOperador = "";
        this._ultimoNumero = "";

        this._operador = []; // atributo, que é um array, para guardar a operação
        this._displayCalcEl = document.querySelector("#display"); //Atributo privado para pegar o display da calculadora
        this.inicializar(); //Método para inicializar a calculadora
        this.inicializarEventosDeBotao();//Método para inicializar eventos de botão
        this.inicializarTeclado();
    }

    colarDaAreaDeTransferencia() {

        document.addEventListener('paste', e => {

            const text = e.clipboardData.getData('Text');

            this.displayCalcEl = parseFloat(text);

        });

    }

    copiarParaAreaDeTransferencia() {

        let input = document.createElement("input");

        input.value = this._displayCalcEl;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    inicializar() {

        this.mostrarUltimoNumeroNoDisplay();
        this.colarDaAreaDeTransferencia();

    }

    inicializarTeclado() {

        document.addEventListener("keydown", e => {
            const tecla = e.key.toLowerCase();
            if (e.shiftKey) {
                switch (tecla) {
                    case "q": // Shift + Q → Raiz quadrada
                        e.preventDefault();
                        this.executarBtn("raiz");
                        return;
                    
                    case "i":  // Shift + I → Inverso
                        e.preventDefault();
                        this.executarBtn("inverso");
                        return;

                    case "e": // Shift + E → Elevar ao quadrado
                        e.preventDefault();
                        this.executarBtn("quadrado");
                        return;   

                }
            }
        });

        document.addEventListener("keyup", e => {

            switch (e.key) {
                case "Backspace":
                    this.limparNumeroAtual();
                    break;

                case "Escape":
                    this.limparTudo();
                    break;

                case "ArrowLeft":
                    this.limparUltimoDigito();
                    break;
                
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.adicionarOperacao(e.key);
                    break;

                case ".":
                case ",":
                    this.adicionarPonto();
                    break;

                case "Enter":
                case "=":
                    this.calcular()
                    break;
                
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.adicionarOperacao(parseInt(e.key));
                    break;
                
                case "c":
                    if (e.ctrlKey) this.copiarParaAreaDeTransferencia();
                    break;
                                  
            }
            console.log(e.key)
        });

    };

    addEventListenerAll(elemento, eventos, nomeFuncao) {
        
        eventos.split(" ").forEach(evento => {
            
            elemento.addEventListener(evento, nomeFuncao, false); // o false serve para que os 2 eventos não sejam disparados ao mesmo tempo
        
        });
    }

    inicializarEventosDeBotao() {

    let botoes = document.querySelectorAll(".row > button");

    //O addEventListener não funcionará, pois ele é um método somente de 1 elemento, para isso, vou precisar de um método para percorrer cada elemento do NodeList da variavel botoes
    
    botoes.forEach((btn, index) => {// Um laço forEach com 2 argumentos para percorrer cada elemento, e para cada elemento da lista, será adicionado um evento de click ao btn

        this.addEventListenerAll(btn , "click drag", event => { // o event será meu parâmetro

            const classeCorrigida = this.removerClassesInutilizaveis(btn.className); //A constante classeCorrigida, recebe o retorno do metodo, passando como parâmetro, a classe de cada botão(que são strings)
                            
            this.executarBtn(classeCorrigida);
            }); 

        });
    }
    
    removerClassesInutilizaveis(classeDoBotao) {
        const classes = classeDoBotao.split(" "); //a constante recebe o parâmetro className, transformado em um array, e separado por espaços
        const segundaClasse = classes[1]; //a constante segundaClasse recebe o segundo elemento(de posição 1) do array classes 
        return segundaClasse.replace("btn-", ""); // a função retorna esta segundaClasse, com "btn-" trocados por um espaço vazio
    };

    limparNumeroAtual() {

        this._operador.pop();

        this.mostrarUltimoNumeroNoDisplay();

    }

    limparTudo() {

        this._operador = [];
        this._ultimoNumero = "";
        this._ultimoOperador = "";
        
        this.mostrarUltimoNumeroNoDisplay();

    }

    limparUltimoDigito() {

    let ultimo = this.pegarUltimaOperacao();

        // Ignora se não houver nenhum item na operação
        if (ultimo === undefined || ultimo === null) return;

        // Se for string ou número, podemos trabalhar com os dígitos
        if (typeof ultimo === 'string' || typeof ultimo === 'number') {
            let str = ultimo.toString();

            // Se tiver mais de um caractere, apaga o último dígito
            if (str.length > 1) {
                str = str.slice(0, -1); // remove o último caractere
                // Se o valor restante for um número válido, atualiza no array
                if (!isNaN(str)) {
                    this.trocarUltimaOperacao(str);
                } else {
                    // Se virar um valor inválido (por exemplo, "-"), apenas substitui com string vazia
                    this.trocarUltimaOperacao("");
                }
            } else {
                // Se só tiver 1 caractere, remove completamente do array
                this._operador.pop();
            }
        } else if (this.ehOperador(ultimo)) {
            // Se o último for um operador (e você quiser que ele também seja apagado), pode descomentar abaixo:
            // this._operador.pop();
        }

        this.mostrarUltimoNumeroNoDisplay();
    }

    pegarUltimaOperacao() { 

        return this._operador[this._operador.length - 1]

    }

    trocarUltimaOperacao(valor) {

        this._operador[this._operador.length - 1] = valor;

    }

    ehOperador(valor) {

        return (["+", "-", "*", "%", "/", "^2", "x^0.5", "1/x", "%", "+-"].indexOf(valor) > -1); 

    }

    puxarOperacao(valor) {

        this._operador.push(valor);

        if (this._operador.length > 3) {

            this.calcular();

        }

    }

    pegarResultado() {

        try {
            return eval(this._operador.join(""));
        }
        catch(e) {
            setTimeout(() => {
                console.log("Você digitou um número, logo em seguida, um operador, e depois pediu o resultado, mas sem você ter digitado o segundo número");
                this.mostrarErro();
            }, 1);
        }

    }

    calcular() {

        let ultimo = "";

        this._ultimoOperador = this.pegarUltimoItem();

        if (this._operador.length < 3) {

            let primeiroItem = this._operador[0];
            this._operador = [primeiroItem, this._ultimoOperador, this._ultimoNumero];

        }

        if (this._operador.length > 3) {
            
            ultimo = this._operador.pop();
            this._ultimoNumero = this.pegarResultado();

        } else if (this._operador.length == 3) {

            this._ultimoNumero = this.pegarUltimoItem(false);

        }

        let resultado = this.pegarResultado();

        if (ultimo == "%") {
            
            resultado /= 100;

            this._operador = [resultado];

        } else {

            this._operador = [resultado];

            if (ultimo) this._operador.push(ultimo);

        }

        this.mostrarUltimoNumeroNoDisplay();
    }

    pegarUltimoItem(ehOperador = true) {

        let ultimoNumero;

        for (let i = this._operador.length-1; i >= 0; i--) {

            if (this.ehOperador(this._operador[i]) == ehOperador) {
                ultimoNumero = this._operador[i];
                break;
            }

        }

        if (!ultimoNumero) {

            ultimoNumero = (ehOperador) ? this._ultimoOperador : this._ultimoNumero;

        }

        return ultimoNumero

    }

    mostrarUltimoNumeroNoDisplay() {

        let ultimoNumero = this.pegarUltimoItem(false);

        if (!ultimoNumero) ultimoNumero = 0;

        this.displayCalcEl = ultimoNumero;

    }

    adicionarOperacao(valor) {

        if (isNaN(this.pegarUltimaOperacao())) { // true
            //String

            if (this.ehOperador(valor)) {
                //Trocar o operador
                this.trocarUltimaOperacao(valor);

            } else {

                this.puxarOperacao(valor);

                this.mostrarUltimoNumeroNoDisplay();

            }

        } else { // false
            //Number
            
            if (this.ehOperador(valor)) {

                this.puxarOperacao(valor);

            } else {

                const novoValor = this.pegarUltimaOperacao().toString() + valor.toString();
                this.trocarUltimaOperacao(novoValor); //o push pega o novoValor, e adiciona a ultima posição do array

                //atualizar display
                this.mostrarUltimoNumeroNoDisplay();
            }

        }

        console.log(this._operador)

    }

    mostrarErro() {

        this.displayCalcEl = "ERRO";

    }

    aplicarOperacaoUnaria(operador) {
        let numero = this.pegarUltimaOperacao();
        
        if (typeof numero !== "number") return;

        let resultado;

        switch (operador) {
            case "^2":
                resultado = Math.pow(numero,2);
                break;

            case "x^0.5":
                resultado = Math.pow(numero, 0.5); 
                break;

            case "1/x":
                if (numero == 0) {
                    this.mostrarErro();
                    return;
                }
                resultado = 1 / numero;
                break;

            default:
                this.mostrarErro();
                return
        }

        this.trocarUltimaOperacao(resultado);
        this.mostrarUltimoNumeroNoDisplay();

    }

    trocarSinal() {

        const index = this._operador.length - 1;
        let ultimaOperacao = this._operador[index];

        // Caso o valor seja uma string que representa número (ex: "123")
        if (typeof ultimaOperacao === "string" && !isNaN(ultimaOperacao)) {
            ultimaOperacao = Number(ultimaOperacao);
        }

        // Se o último item é um número válido, inverte o sinal
        if (typeof ultimaOperacao === "number" && !isNaN(ultimaOperacao)) {
            this._operador[index] = ultimaOperacao * -1;
        }

        // Se o último item é um operador, significa que o usuário quer começar a digitar um número negativo
        else if (this.ehOperador(ultimaOperacao)) {
            this._operador.push(-0); // insere um número negativo inicial (será completado pelo usuário)
        }

        // Caso o array esteja vazio, permite começar com número negativo
        else if (this._operador.length === 0) {
            this._operador.push(-0);
        }

        this.mostrarUltimoNumeroNoDisplay();

    }

    adicionarPonto() {

        const ultimaOperacao = this.pegarUltimaOperacao();

        if (typeof ultimaOperacao === "string" && ultimaOperacao.split("").indexOf(".") > -1) return;

        if (this.ehOperador(ultimaOperacao) || !ultimaOperacao) {
            this.puxarOperacao("0.");
        } else {
            this.trocarUltimaOperacao(ultimaOperacao.toString() + ".");
        }

        this.mostrarUltimoNumeroNoDisplay();
    }

    executarBtn(valor) {

        switch (valor) {
            case "CE":
                this.limparNumeroAtual();
                break;

            case "clear":
                this.limparTudo();
                break;

            case "clearlastdigit":
                this.limparUltimoDigito();
                break;
            
            case "soma":
                this.adicionarOperacao("+");
                break;

            case "subtracao":
                this.adicionarOperacao("-");
                break;

            case "multiplicacao":
                this.adicionarOperacao("*");
                break;

            case "divisao":
                this.adicionarOperacao("/");
                break;
            
            case "porcento":
                this.adicionarOperacao("%");
                break;

            case "quadrado":
                this.aplicarOperacaoUnaria("^2");
                break;

            case "raiz":
                this.aplicarOperacaoUnaria("x^0.5");
                break;

            case "inverso":
                this.aplicarOperacaoUnaria("1/x");
                break;

            case "maisoumenos":
                this.trocarSinal("+-");
                break;

            case "ponto":
                this.adicionarPonto(".");
                break;

            case "igual":
                this.calcular()
                break;
            
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.adicionarOperacao(Number(valor));
                break;
                                  
        
            default:
                this.mostrarErro();
                break;
        }

    }
    
    get displayCalcEl() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalcEl(valor) {

        if (valor.toString().length > 10) {
            this.mostrarErro();
            return false;
        }

        this._displayCalcEl.innerHTML = valor;
    }
    
}
