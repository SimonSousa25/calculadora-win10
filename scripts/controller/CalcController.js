//Utilizando o paradigma da Programação Orientada a Objetos
class CalcController {

    constructor() {

        this._displayCalcEl = document.querySelector("#display"); //Atributo privado para pegar o display da calculadora
        this.inicializar(); //Método para inicializar a calculadora
        this.inicializarEventosDeBotao();//Método para inicializar eventos de botão
    }

    inicializarEventosDeBotao() {

        let botoes = document.querySelectorAll(".row > button");

        console.log(botoes);

        //O addEventListener não funcionará, pois ele é um método somente de 1 elemento, para isso, vou precisar de um método para percorrer cada elemento do NodeList da variavel botoes
        
        botoes.forEach((btn, index) => {// Um laço forEach com 2 argumentos para percorrer cada elemento, e para cada elemento da lista, será adicionado um evento de click ao btn

            btn.addEventListener('click', event => { // o event será meu parâmetro

                const classeCorrigida = this.removerClassesInutilizaveis(btn.className); //A constante classeCorrigida, recebe o retorno do metodo, passando como parâmetro, a classe de cada botão(que são strings)
                console.log(classeCorrigida); //cada classe do elemento será impresso no console, após um click

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
