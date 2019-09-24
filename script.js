const urlPokemon1Geracao = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151'
let ar = []

function iniciar(){
    gerarQuiz()
    //setTimeout(getAr(), 3000) 
    setTimeout(function(){getAr()}, 1000)//Ver se os segundos para esperar copular os dados está com bom desempenho 
}

function gerarQuiz(/*nomeParticipante, dificuldade*/){
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
                let index = Math.floor(Math.random() * 150) + 1

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
}

