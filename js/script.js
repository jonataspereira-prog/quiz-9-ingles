const perguntas = [
{
    pergunta: "We're still waiting for Bill. He ______ _________ yet.",
    respostas: ["hasn't come", "haven't come", "hasn't came", "haven't came"],
    correta: 0,
    tempo: 20
},

{
    pergunta: "They have studied here _____ a long time.",
    respostas: ["for", "already", "yet", "since"],
    correta: 0,
    tempo: 20
},

{
    pergunta: `Complete the sentences. Then, pick the correct option.

            II. Physicians and researchers ______ the cure for Aids since it appeared.

            III. The violence in big cities ______ a lot of deaths.

            I. Computers ______ a useful machine since the 30s.`,

    respostas: ["has researched / has promoted / has been", "have researched / has promoted / have been", "have researched / has promoted / has been", "has researched / have promoted / have been"],
    correta: 1,
    tempo: 40
},

{
    pergunta: "O uso do Present Perfect, no primeiro quadrinho da tirinha (em I've decided), pode ser explicado por se tratar de uma ação ",
    imagem: "../imagens/p1.jpg",
    respostas: ["que ocorre uma única vez no presente.", "que se inicia no passado e termina no passado.", "que se inicia no presente e se estende até o futuro.", "ocorrida no passado, mas com um resultado importante no presente."],
    correta: 3,
    tempo: 90
},

{
    pergunta: "In the first part, “but they're kinda slow”, the word but can be replaced by",
    imagem: "../imagens/p2.jpg",
    respostas: ["moreover", "therefore", "however", "actually"],
    correta: 2,
    tempo: 90
},

{
    pergunta: "In the first part of the comic strip, the word <b>but</b> is used to show a contrast. What is being contrasted?",
    imagem: "../imagens/p2.jpg",
    respostas: ["The fact that hybrid cars are not very fast, yet they are stylish.", "The fact that hybrid cars are good for the environment, but expensive.", "The fact that hybrid cars are expensive, but fast.", "The fact that hybrid cars are fast, but polluting."],
    correta: 0,
    tempo: 90
}

];

let pontos = 100;
let indice = 0;
let jogador = "";
let avatar = "😎";
let acertos = 0;
let tempo = 15;
let cronometro;

const pergunta = document.getElementById("pergunta");
const alternativas = document.getElementById("alternativas");
const pontosTela = document.getElementById("pontos");
const nomeJogador = document.getElementById("nomeJogador");
const txtNome = document.getElementById("txtNome");
const telaInicio = document.getElementById("inicio");
const emojis = document.querySelectorAll(".emoji");
const tempoTela = document.getElementById("tempo");

const somAcerto = new Audio("./audios/acerto.mp3");
const somErro = new Audio("./audios/erro.mp3");
const somGameOver = new Audio("./audios/gameover.mp3");
const somVitoria = new Audio("./audios/vitoria.mp3");

somAcerto.preload = "auto";
somErro.preload = "auto";
somGameOver.preload = "auto";
somVitoria.preload = "auto";

document.getElementById("btnIniciar").onclick = iniciar;

// Seleção de avatar

emojis.forEach(function(emoji){

    emoji.addEventListener("click", function(){

        emojis.forEach(function(e){
            e.classList.remove("selecionado");
        });

        this.classList.add("selecionado");

        avatar = this.innerText;

    });

});

// Iniciar jogo

function iniciar(){

    jogador = txtNome.value.trim();


    if(jogador == ""){

        alert("Digite seu nome");
        txtNome.focus();
        return;

    }

    nomeJogador.innerHTML = avatar + " " + jogador;

    telaInicio.classList.add("oculto");

    document.getElementById("jogo").classList.remove("oculto");

    somAcerto.load();
    somErro.load();
    somGameOver.load();
    somVitoria.load();

    embaralharPerguntas();

    carregarPergunta();

}

function iniciarCronometro(){

    tempo = perguntas[indice].tempo || 15;

    tempoTela.innerHTML = tempo;

    clearInterval(cronometro);

    cronometro = setInterval(function(){

        tempo--;

        tempoTela.innerHTML = tempo;

        if(tempo <= 0){

            clearInterval(cronometro);

            responder(false, null);

        }

    }, 1000);

}

// Carregar pergunta

function carregarPergunta(){

    alternativas.innerHTML = "";

    if(indice >= perguntas.length){

        fimDeJogo();
        return;

    }

    pergunta.innerHTML = perguntas[indice].pergunta; 

        if (perguntas[indice].imagem) { 

            let imagem = document.createElement("img"); 
            imagem.src = perguntas[indice].imagem; 
            imagem.className = "foto"; 
            imagem.alt = "Imagem da pergunta"; 
            pergunta.appendChild(imagem); 

        }

    // Barra de progresso

    document.getElementById("contadorPergunta").innerHTML =
    `Pergunta ${indice + 1} de ${perguntas.length}`;

    document.getElementById("progresso").style.width =
    `${((indice + 1) / perguntas.length) * 100}%`;

    let respostas = [];

    // Cria cópia das respostas

    for(let i = 0; i < perguntas[indice].respostas.length; i++){

        respostas.push({

            texto: perguntas[indice].respostas[i],

            correta: i === perguntas[indice].correta

        });

    }
    
        iniciarCronometro();

    // Embaralha alternativas

    embaralharArray(respostas);

    respostas.forEach(function(item){

        let botao = document.createElement("button");

        botao.innerText = item.texto;

        botao.className = "alternativa";

        botao.dataset.correta = item.correta;

        botao.onclick = function(){

            responder(item.correta, botao);

        };

        alternativas.appendChild(botao);

    });

}

// Responder

function responder(acertou, botaoClicado){

    clearInterval(cronometro);

    let botoes = document.querySelectorAll(".alternativa");

    // Impede clicar várias vezes

    botoes.forEach(function(botao){

        botao.disabled = true;

    });

    if(acertou){

    somAcerto.currentTime = 0;
    somAcerto.play();

    pontos += 50;

    acertos++;

    botaoClicado.classList.add("correta");


    }else{

    somErro.currentTime = 0;
    somErro.play();

    pontos -= 50;

    if(botaoClicado){

    botaoClicado.classList.add("errada");

    }
        // Mostra a resposta correta

        botoes.forEach(function(botao){


            if(botao.dataset.correta === "true"){


                botao.classList.add("correta");

            }

        });

    }

    pontosTela.innerHTML = pontos;

    setTimeout(function(){

        if(pontos <= 0){

            gameOver();

            return;

        }

        indice++;

        carregarPergunta();

    },1500);

}

// Game Over

function gameOver(){

    somGameOver.currentTime = 0;
    somGameOver.play();

    document.getElementById("jogo").classList.add("oculto");

    document.getElementById("fim").classList.remove("oculto");

    document.getElementById("progresso").style.width = "100%";

    document.getElementById("mensagemFinal").innerHTML =

    "Que pena, <b>" + avatar + " " + jogador +

    "</b>! 🥺<br><br>Você terminou com <b>" +

    pontos + "</b> pontos.";

}

function calcularRecompensa(){

    let estrelas = "";
    let medalha = "";

    // Estrelas pela pontuação

    if(pontos >= 300){

        estrelas = "⭐⭐⭐⭐⭐";

    }else if(pontos >= 200){

        estrelas = "⭐⭐⭐";

    }else{

        estrelas = "⭐";

    }

    // Medalha pelos acertos

    if(acertos >= 4){

        medalha = "🥇 Medalha de Ouro";

    }else if(acertos >= 2){

        medalha = "🥈 Medalha de Prata";

    }else{

        medalha = "🥉 Medalha de Bronze";

    }

    return {

        estrelas: estrelas,

        medalha: medalha

    };

}

// Final do jogo

function fimDeJogo(){

    somVitoria.currentTime = 0;
    somVitoria.play();

    document.getElementById("jogo").classList.add("oculto");

    document.getElementById("fim").classList.remove("oculto");

    document.getElementById("progresso").style.width = "100%";

    let recompensa = calcularRecompensa();

    document.getElementById("mensagemFinal").innerHTML =

    "Parabéns, <b>" + avatar + " " + jogador +
    "</b>! 🎉😎<br><br>" +

    "🏆 Pontuação final: <b>" + pontos + "</b><br>" +

    "✅ Acertos: <b>" + acertos + "/" + perguntas.length + "</b><br><br>" +

    "<span class='estrelas'>" + recompensa.estrelas + "</span><br><br>" +

    recompensa.medalha;

}

// Reiniciar

function reiniciar(){

    clearInterval(cronometro);

    tempo = 15;

    tempoTela.innerHTML = tempo;

    pontos = 100;
    indice = 0;
    jogador = "";
    avatar = "😎";
    acertos = 0;

    emojis.forEach(function(e){

        e.classList.remove("selecionado");

    });

    emojis[0].classList.add("selecionado");

    pontosTela.innerHTML = pontos;

    txtNome.value = "";

    document.getElementById("fim").classList.add("oculto");

    document.getElementById("jogo").classList.add("oculto");

    telaInicio.classList.remove("oculto");

    document.getElementById("progresso").style.width = "0%";

    document.getElementById("contadorPergunta").innerHTML = "";

    txtNome.focus();

}

// Embaralhar perguntas

function embaralharPerguntas(){

    perguntas.sort(() => Math.random() - 0.5);


}

// Embaralhar alternativas

function embaralharArray(array){

    for(let i = array.length - 1; i > 0; i--){

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}

// Enter inicia jogo

txtNome.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        iniciar();

    }


});