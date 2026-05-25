/**
 * Point d'entrée de semantic.html
 * Identique à app.js sauf qu'il instancie SemanticGame
 * semantic-app.js n'a pas besoin d'appeler ApiService directement :
 * SemanticGame.startGame() s'en charge en interne
 */

import { SemanticGame } from './SemanticGame.js';

const semanticGame = new SemanticGame();

document.querySelector('.game-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await semanticGame.startGame();
});

document.getElementById('abandon-btn').addEventListener('click', () => {
  semanticGame.abandonGame();
});
