import { init } from '/src/js/game.js';

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const canvas = document.querySelector('canvas');
const startMessage = document.getElementById('startMessage');

let gameStarted = false;

startButton.addEventListener('click', () => {
	startButton.style.display = 'none';
	startMessage.style.display = 'none';
	canvas.classList.remove("canvasHidden")
	canvas.focus();
	gameStarted = true;
	init(); // Inicializa o jogo quando o botão Start for clicado
});

restartButton.addEventListener('click', () => {
	restartButton.style.display = 'none';
	canvas.focus();
	gameStarted = true;
	init(); // Reinicializa o jogo quando o botão Restart for clicado
});