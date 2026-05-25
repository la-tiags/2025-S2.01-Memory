/**
 * Point d'entrée de l'application Memory.
 *
 * MODIFICATIONS pour le mode sémantique (marquées ── SEMANTIC ──) :
 *   1. Import de SemanticGame
 *   2. Instanciation de semanticGame
 *   3. Exposition de 3 fonctions sur window (openSemanticPanel, closeSemanticPanel, startSemanticGame)
 *      → nécessaire car les onclick="..." du HTML ne peuvent pas accéder aux modules ES directement
 *
 * Tout le reste est inchangé.
 */

import { Game }         from './Game.js';
import { ApiService }   from './ApiService.js';
import { SemanticGame } from './SemanticGame.js'; // ── SEMANTIC ── import

// ── Jeu principal (inchangé) ───────────────────────────────────────────────
const game = new Game();

document.querySelector('.game-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const pseudo     = document.getElementById('pseudo').value.trim();
  const difficulty = parseInt(document.getElementById('difficulty').value, 10);

  if (!pseudo) return;

  try {
    const { id } = await ApiService.createGame(pseudo, difficulty);
    game.startGame(id);
  } catch (error) {
    console.error('Erreur lors du démarrage de la partie :', error);
  }
});

document.getElementById('abandon-btn').addEventListener('click', () => {
  game.abandonGame();
});

// ── SEMANTIC : instanciation ───────────────────────────────────────────────
const semanticGame = new SemanticGame();

// ── SEMANTIC : fonctions exposées au HTML ──────────────────────────────────
// Les onclick="..." dans index.html ne peuvent pas accéder aux modules ES.
// On expose donc ces trois fonctions sur window comme pont HTML ↔ module.

/** Ouvre le panel latéral sémantique. */
window.openSemanticPanel = () => {
  document.getElementById('semantic-panel').classList.add('open');
};

/** Ferme le panel latéral sémantique. */
window.closeSemanticPanel = () => {
  document.getElementById('semantic-panel').classList.remove('open');
};

/** Lance une partie sémantique (appelé par le bouton "Lancer" du panel). */
window.startSemanticGame = () => {
  semanticGame.start();
};
