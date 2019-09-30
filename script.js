/**ROTEIRO
 * array com 40 posicoes, cada posição deve ter um numero de 1 a 151 aleatoriamente sem repetir
 * loop realizando a requisição do pokemon com base no valor do array de 40 posição, salvando no minimo seu nome e imagem em um Obj
 * vincular a qual numero da questao cada pokemon pertence no Obj (array de obj?) pokemon (4 alternativas)
 * a cada pergunta escolher aleatoriamente qual das 4 questões é a correta e vincular no Obj
 * 
 * no html:
 * botao iniciar quiz (insere nome e talvez nivel dificuldade)
 * aparecer cada pergunta com alternativa, com base no atributo "pergunta" do obj do pokemon
 * ao seleciona uma das opções,verificar se ela é a correta com base no atributo "correto" do obj,e dar feedback visual se está correto ou não 
 * ao final de responder todas as questões, mostrar o nome do participante e quantidade de acertos
 */

 
 /**
  * O QUE FALTA FAZER:
  * COLOCAR A IMAGEM DE UM DOS POKEMONS GERADOS NAS ALTERNATIVAS E VINCULAR QUAL DAS OPÇÕES É A CORRETA
  */

let arrayPoke = []//obj de pokemons
let nomeJogador = ''
//caminho das imagens de certo e errado
const imgCerto = 'img/certo.png'
const imgErrado = 'img/errado.png'

async function gerarQuiz(){
    let numeros = []
    //forma o array de 40 numeros aleatorios, sem se repetir
    for(let i = 0; i < 40; i++){
        let aleatorio = Math.floor(Math.random() * 151) + 1
        if(numeros.indexOf(aleatorio) == -1){
            
            numeros.push(aleatorio)
        }
        else{
            i--
        }
    }
    
    numeros.sort(sortfunction)//apenas para teste
    console.log(numeros)
    
    //requisição retornando dados do pokemon
     //array objeto pokemons
    let questao = 0//coloca numero da questao
    for(let i = 0; i < 40; i++){
      
        //if(i == 4 || i == 8 || i == 12 || i == 16 || i == 20 || i == 24 || i == 28 || i == 32 || i == 36) questao++
        if(i % 4 == 0) questao++
            
        let dp = await requisitaDadosPokemon(numeros[i])//Dados Pokémons
        const objPoke = new Pokemon(
            questao,
            dp.nome,
            dp.back_default,
            dp.front_default,
            dp.back_shiny,
            dp.front_shiny
        )//parametros: nº pergunta, nome e imagens
        arrayPoke.push(objPoke)

        //questao++
        
    }
    console.log(arrayPoke)
}

let perguntaAtual = 1
let arrayAlternativas = []
//inicia o quiz (mostra primeira pergunta)
function iniciarQuiz(){//talvez alterar para o nome de 'proximaPergunta'

    //deixa mesma tonalidade azul no inicio do quiz
    for(let i = 0; i < 4; i++){
        document.getElementById(`opcao${i+1}`).style.backgroundColor = 'blue'
    }

    let jogador = document.getElementById('jogador')
    nomeJogador = jogador.value

    if(nomeJogador == '' || nomeJogador == null){
        alert("Favor informe seu nome!")
    }

    else{

        //insere numero da pergunta na tabela e linha divisoria
        document.getElementById(`n${perguntaAtual}`).innerHTML = perguntaAtual
        document.getElementById(`pergunta${perguntaAtual}`).setAttribute('class','linha_tabela')
    
        document.getElementById('n').innerHTML = `<u>PERGUNTA Nº ${perguntaAtual}</u>`
        arrayAlternativas = []//limpa as alternativas anteriores
        //pega apenas as alternativas para essa pergunta (no caso seleciona 4 pokemons)
        for(i in arrayPoke){
            if(arrayPoke[i].pergunta == perguntaAtual){
                arrayAlternativas.push(arrayPoke[i])
            }
        }
        //coloca o nome dos pokemons nas opções
        for(let i = 0; i < 4; i++){
            let opcao = document.getElementById(`opcao${i+1}`)
            //opcao.setAttribute('class', `${arrayAlternativas[i].nome} btn btn-primary`)
            opcao.innerHTML = arrayAlternativas[i].nome
            console.log(opcao.getAttribute('id'))
        }
    
        //selecionar aleatoriamente uma das opções como certa e salvar para testar posteriormente se está certo a alternativa selecionada
        //por ser usado no array, vai de 0 a 3 (totalizando 4)
        let selecionaCorreta = Math.floor(Math.random() * 4)
        console.log(selecionaCorreta)
    
        //colocar a img da opção certa
        document.getElementById('imgPoke').src = arrayAlternativas[selecionaCorreta].front_default
    
        perguntaAtual++
        
        ocultaInicio()
        mostraPerguntas()
    }

}

let pontuacao = 0

//corrige a resposta da pergunta atual, e após alguns segundos avança para a proxima, recebe como parametro o numero da opção selecionada
function geraAlternativas(numOpcao){
    
    //compara se a imagem da opção selecionada é igual a imagem que foi mostrada na pergunta
    if(arrayAlternativas[numOpcao-1].front_default == document.getElementById('imgPoke').src){
        console.log("ACERTOU")
        //document.getElementById('msgAcerto').style.display = 'flex'//alerta (talvez remover)
        document.getElementById(`opcao${numOpcao}`).style.backgroundColor = 'green'
        document.getElementById(`img${perguntaAtual - 1}`).src = imgCerto// icone de certo
        //document.getElementById(`poke${perguntaAtual - 1}`).style.backgroundColor = 'green'// cor de certo
        pontuacao += 10//caso acertou ganha 10 pontos
    }
    else{
        console.log("ERROU")
        //document.getElementById('msgErro').style.display = 'flex'
        document.getElementById(`opcao${numOpcao}`).style.backgroundColor = 'red'
        document.getElementById(`img${perguntaAtual - 1}`).src = imgErrado// icone errado
        //document.getElementById(`poke${perguntaAtual - 1}`).style.backgroundColor = 'red'// cor de errado
        //condição para descobrir qual opção é a correta para dar feedback visual
        for(let i in arrayAlternativas){
            if(arrayAlternativas[i].front_default == document.getElementById('imgPoke').src){
                console.log(`opcao${Number(i)+1}`)
                document.getElementById(`opcao${Number(i)+1}`).style.backgroundColor = 'green'
            }
        }
    }
    //coloca img do pokemon certo que foi respondido na tabela
    document.getElementById(`poke${perguntaAtual - 1}`).src = document.getElementById('imgPoke').src

    setTimeout(function(){
        ocultaAlertas()
    },300)

    //caso seja respondido todas as perguntas, mostrar a pontuação
    if(perguntaAtual == 11){
        console.log("FIM")
        //exibe tela de pontuação
        document.getElementById('pontuacao').style.display =  'flex'
        //oculta tela de perguntas
        document.getElementById('perguntas').style.display =  'none'
        //processa os dados e elementos pertinentes a pontuação do jogador
        geraPontuacao()
    }
    else{

        setTimeout(function(){
            iniciarQuiz()
        },300)
    }
    
}

function geraPontuacao(){
    document.getElementById('texto_pontuacao').innerHTML = `<b>${nomeJogador}</b>, sua pontuação foi <b>${pontuacao}</b> de 100`
}

function ocultaAlertas(){
    //ocultar msg de erro e acerto (talvez remover)
    /*document.getElementById('msgErro').style.display = 'none'
    document.getElementById('msgAcerto').style.display = 'none'*/

    //faz com que a cor de fundo de todas as alternativas volter a cor original
    for(let i = 0; i < 4; i++){
        document.getElementById(`opcao${i+1}`).style.backgroundColor = 'blue'
    }

}

async function requisitaDadosPokemon(id){
    const poke = fetch('https://pokeapi.co/api/v2/pokemon/'+id)
    .then(response =>{
        return response.json()
    })
    .then(data =>{
        const resumoPoke = {
            nome: data.name,
            back_default: data.sprites.back_default,
            front_default: data.sprites.front_default,
            back_shiny: data.sprites.back_shiny,
            front_shiny: data.sprites.front_shiny
        }
        return resumoPoke
        //return data
    })
    return poke
}

//ANIMAÇÕES
function ocultaInicio(){
    let inicio = document.getElementById('inicio')
    inicio.style.display = 'none'
}
function mostraPerguntas(){
    let pergunta = document.getElementById('perguntas')
    pergunta.style.display = 'flex'
}

//MODELO
async function chama(){
    let x = await requisitaDadosPokemon("1")
    console.log(x)
}

//caracteristicas pokemon
class Pokemon{

    constructor(pergunta,nome,back_default,front_default,back_shiny,front_shiny){
        this.pergunta = pergunta
        this.nome = nome
        this.back_default = back_default
        this.front_default = front_default
        this.back_shiny = back_shiny
        this.front_shiny = front_shiny
    }

    setCerta(certa){
        this.certa = certa
    }
    getCerta(){
        return this.certa
    }
 
}

//função para permitir ordenação de numeros inteiros (essa função deve ser passado como parametro para sort())
function sortfunction(a, b){
    return (a - b) //faz com que o array seja ordenado numericamente e de ordem crescente.
}

//MODELOS TESTADOS ABAIXO

const urlPokemon1Geracao = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151'
let ar = []

function iniciar(){
    gerarQuizteste()
    //setTimeout(getAr(), 3000) 
    setTimeout(function(){getAr()}, 1000)//Ver se os segundos para esperar copular os dados está com bom desempenho 
}

function gerarQuizteste(/*nomeParticipante, dificuldade*/){
    let arrayPoke = []
    
    fetch(urlPokemon1Geracao)
    .then(response => {
        //console.log(response.json())
        return response.json()
    })
    .then(dados => {
        console.log(dados.results)

        //copulando array com dados dos pokemons
        for(let i = 1; i <= 10; i++){//nº pergunta
            for(let j = 1; j <= 4; j++){//alternativas
                //console.log(`pergunta nº ${i} altertativa ${j}`)

                //selecionando um pokemon aleatorio
                // o "150" deve ser recebido depois dinamicamente(variando conforme nivel de dificuldade)
                let index = Math.floor(Math.random() * 151) + 1

                //console.log(dados.results[index].name)
                //console.log(dados.results[index].url)//talvez remover  
                               
                let poke = new Pokemon(i,dados.results[index].name,dados.results[index].url)//(nº pergunta, nomePoke, urlPoke)
                arrayPoke.push(poke)
                
            }
        }

        for(let i = 0; i < arrayPoke.length; i++){
            console.log("TESTE: "+arrayPoke[i])
            //console.log("TESTE: ")
        }

        return arrayPoke
        
    })
    .then(objPoke =>{
        console.log(objPoke)

        //objPoke[0].setImg( pesquisaPokemon(objPoke[0].nome))
        //console.log(objPoke[0]) 

        ar = copulaArray(objPoke)

        //return objPoke
    })

    /*console.log("teste")
    console.log(arrayPoke.length)
    for(let i = 0; i < arrayPoke.length; i++){
        //console.log("TESTE: "+arrayPoke[i])
        console.log("TESTE: ")
    }*/

}

//insere as imagens nos pokemon de resposta
function getAr(){
    console.log("aqui:")
    console.log(ar)

    //acessando apenas uma das alternativas entre as 4 de uma pergunta
    for(let i = 0; i < ar.length; i+=4){
        console.log(ar[i])
        
    }
    //INICIO TESTE
    const funcaoAsync = async (id) =>{
        let response = await fetch('https://pokeapi.co/api/v2/pokemon/'+id)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            return data
        })

        console.log(response)
        //return data.order
    }
    
    let result = funcaoAsync("2");
    //FIM TESTE
}

function copulaArray(obj){
    //console.log(obj[0])
    //console.log(obj.length)
    let tam = obj.length
    let pokemons = obj

    for(let i = 1; i <= tam; i+=3){
        //console.log(pokemons[i])
    }

    return pokemons

}

function pesquisaPokemon(nome){
    let retornoImg = {}
    fetch("https://pokeapi.co/api/v2/pokemon/"+nome)
    .then(resp =>{
        return resp.json()
    })
    .then(data =>{
        //console.log(data.sprites.back_default)
        //return data.sprites.back_default
        //console.log(data.sprites)
        retornoImg = data.sprites
        //console.log(retornoImg)
        //return data.sprites
    })

    return retornoImg
}

//modelo numero aleatorio:
/*let index = Math.floor(Math.random() * 150) + 1
console.log(index)*/


/* ANTIGO:
class Pokemon{
    constructor(pergunta,nome,url){
        this.pergunta = pergunta
        this.nome = nome
        this.url = url
    }
    setImg(img){
        this.img = img
    }
    getImg(){
        return this.img
    }
    setCerta(certa){
        this.certa = certa
    }
    getCerta(){
        return this.certa
    }
}*/