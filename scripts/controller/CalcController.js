//Utilizando o paradigma da Programação Orientada a Objetos
class CalcController {

    constructor() {

        this._operador = []; // atributo, que é um array, para guardar a operação
        this._displayCalcEl = document.querySelector("#display"); //Atributo privado para pegar o display da calculadora
        this.inicializar(); //Método para inicializar a calculadora
        this.inicializarEventosDeBotao();//Método para inicializar eventos de botão
    }

    addEventListenerAll(elemento, eventos, nomeFuncao) {
        
        eventos.split(" ").forEach(evento => {
            
            elemento.addEventListener(evento, nomeFuncao, false); // o false serve para que os 2 eventos não sejam disparados ao mesmo tempo
        
        });
    }

    limparNumeroAtual() {

        this._operador.pop();

    }

    limparTudo() {

        this._operador = [];

    }

    limparUltimoDigito() {



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

    calcular() {

        let ultimo = this._operador.pop();

        let resultado = eval(this._operador.join(""))

        this._operador = [resultado, ultimo];

        this.mostrarNumeroNoDisplay();
    }

    mostrarNumeroNoDisplay() {

        let ultimoNumero;

        for (let i = this._operador.length-1; i >= 0; i--) {

            if (!this.ehOperador(this._operador[i])) {
                ultimoNumero = this._operador[i];
                break;
            }

        }

        this.displayCalcEl = ultimoNumero;

    }

    adicionarOperacao(valor) {

        if (isNaN(this.pegarUltimaOperacao())) { // true
            //String

            if (this.ehOperador(valor)) {
                //Trocar o operador
                this.trocarUltimaOperacao(valor);

            } else if (isNaN(valor)) {

                console.log("Outra coisa", valor);

            } else {

                this.puxarOperacao(valor);

                this.mostrarNumeroNoDisplay();

            }

        } else { // false
            //Number
            
            if (this.ehOperador(valor)) {

                this.puxarOperacao(valor);

            } else {

                const novoValor = this.pegarUltimaOperacao().toString() + valor.toString();
                this.trocarUltimaOperacao(parseInt(novoValor)); //o push pega o novoValor, e adiciona a ultima posição do array

                //atualizar display
                this.mostrarNumeroNoDisplay();
            }

        }

    }

    mostrarErro() {

        this.displayCalcEl = "ERRO";

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

            case "quadrado":
                this.adicionarOperacao("^2");
                break;

            case "raiz":
                this.adicionarOperacao("x^0.5");
                break;

            case "inverso":
                this.adicionarOperacao("1/x");
                break;

            case "porcento":
                this.adicionarOperacao("%");
                break;

            case "maisoumenos":
                this.adicionarOperacao("+-");
                break;

            case "ponto":
                this.adicionarOperacao(".");
                break;

            case "igual":

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


    inicializar() {

        let displayCalcEl = document.querySelector("#display");

    }
    
    get displayCalcEl() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalcEl(valor) {
        this._displayCalcEl.innerHTML = valor;
    }
    
}
