import { keyPress, key } from "/src/js/keyboard.js";
import Enemy from "/src/js/Enemy.js";
import Pikachu from "/src/js/Pikachu.js";
import Thunder from "/src/js/Thunder.js";
import { loadImage } from '/src/js/loaderAssets.js';

const FRAMES = 60;
const pikachu = new Pikachu(300, 100, 4, 82, 89, FRAMES);
let enemies = Array.from({ length: 3 });
let thunder = null;
let ctx;
let canvas;
let gameover;
let boundaries;
let score;
let anime;
let powerUpActive = false;
let powerUpDuration = 10000; // Duração do Power-Up (10 segundos)
let themeSound;
let gameoverSound;
let pickupSound;
let backgroundImg;

const createLightning = () => {
    const margin = 50;
    const x = Math.random() * (canvas.width - 2 * margin) + margin;
    const y = Math.random() * (canvas.height - 2 * margin) + margin;
    return { x, y };
};

const createEnemy = () => {
    const margin = 50;
    const x = Math.random() * (canvas.width - 2 * margin) + margin;
    const y = Math.random() * (canvas.height - 2 * margin) + margin;
    return new Enemy(x, y, 28, 28, 5, 'public/assets/imgs/pokeball.png');
};

const init = async () => {
    score = 0;
    gameover = false;

    console.log("Initialize Canvas");
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    // Inicializa os sons
    themeSound = new Audio('public/assets/sounds/theme.mp3');
    gameoverSound = new Audio('public/assets/sounds/gameover.mp3');
    pickupSound = new Audio('public/assets/sounds/pickup.mp3');

    // Reproduz música de fundo
    themeSound.loop = true;
    themeSound.play();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boundaries = {
        width: canvas.width,
        height: canvas.height
    };

    // Carrega a imagem de fundo
    backgroundImg = await loadImage('public/assets/imgs/grass.png');

    // Inicializa os inimigos (Pokébolas)
    enemies = enemies.map(() => createEnemy());

    keyPress(window);
    start();
};

const start = () => {
    let startInterval = setInterval(() => {
        clearInterval(startInterval);
        loop();
    }, 1000);
};

const loop = () => {
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenha o fundo
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        score += 3 / FRAMES; // Aumenta a pontuação com base no tempo

        // Desenha o score na tela
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`Pontos: ${Math.floor(score)}`, 10, 10);

        // Desenha os elementos do jogo
        pikachu.move(boundaries, key);
        pikachu.draw(ctx);

        enemies.forEach(e => {
            e.move(boundaries);
            e.draw(ctx);

            if (pikachu.colide(e)) {
                gameover = true;
                showGameOverMessage();
            }
        });

        // Lógica para aparecer o raio
        if (Math.floor(score) % 50 === 0 && Math.floor(score) !== 0 && !thunder) {
            thunder = new Thunder(
                ...Object.values(createLightning()),
                32, // Largura do raio
                32, // Altura do raio
                'public/assets/imgs/thunder.png'
            );
        }

        if (thunder) {
            thunder.draw(ctx);
            if (pikachu.colide(thunder)) {
                powerUpActive = true;
                thunder = null; 
                pikachu.speed *= 2; 

                enemies.forEach(e => e.speed /= 2);

                setTimeout(() => {
                    pikachu.speed /= 2;
                    enemies.forEach(e => e.speed *= 2);
                    powerUpActive = false;
                }, powerUpDuration);
            }
        }

        if (gameover) {
            console.error('DEAD!!!');
            cancelAnimationFrame(anime);

            // Mostra o botão de restart
            document.getElementById('restartButton').style.display = 'block';
        } else {
            anime = requestAnimationFrame(loop);
        }

    }, 1000 / FRAMES);
};

const showGameOverMessage = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

    // Para a música de fundo e reproduz o som de game over
    themeSound.pause();
    gameoverSound.play();
};

document.getElementById('restartButton').addEventListener('click', () => {
    // Esconde o botão de restart novamente
    document.getElementById('restartButton').style.display = 'none';
    // Reinicia o jogo
    init();
});

export { init };
