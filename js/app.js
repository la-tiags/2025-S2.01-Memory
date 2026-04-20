import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';

const domManager = new DOMManager();
const game = new Game();


document.querySelector('.game-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  // Récupération des valeurs du formulaire
  const pseudo = document.querySelector('#pseudo').value;
  const difficulty = document.querySelector('#difficulty').value;
  const collection = document.querySelector('#collection').value;

  try {
    // On passe ici le pseudo et la difficulté récupérés dans le formulaire
    const data = await ApiService.createGame(pseudo, difficulty);
    console.log('Success:', data, data.id);
    game.startGame(data.id);
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Erreur lors de la création de la partie');
  }
});