import { Game }                from './Game.js';
import { semanticCollections } from './SemanticCollections.js';
import { ApiService }          from './ApiService.js';

const PAIR_COUNTS = Object.freeze({ 1: 4, 2: 6, 3: 8 });

export class SemanticGame extends Game {

  // Override 1
  // Game.startGame(id) attend un id serveur fourni par ApiService.
  // Ici on court-circuite l'appel API : on crée bien une partie sur
  // le serveur pour enregistrer le score, mais on passe directement
  // à _start() sans attendre une collection externe.

  async startGame() {
    const { difficulty, collectionName } = this._domManager.getFormValues();

    // Crée la partie sur le serveur pour avoir un id (pour le score)
    try {
      const pseudo = document.getElementById('pseudo').value.trim();
      const { id } = await ApiService.createGame(pseudo, difficulty);
      this._gameId = id;
    } catch (error) {
      console.error('Erreur création partie sémantique :', error);
      this._gameId = null;
    }

    const collection     = semanticCollections['semantic'];
    const pairedImages   = this._createPairedImages(collection, difficulty);
    this._remainingPairs = pairedImages.length / 2;

    this._buildCards(pairedImages);
    this._domManager.showGame();
    this._combo = 0;
    this._moves = 0;
    this._timer.start();
    this._domManager.updateMoves(this._moves);
  }

  // Override 2
  // Game retourne [image, image] (même image doublée).
  // SemanticGame retourne [pair.a, pair.b] (deux images différentes,
  // même pairId) — c'est toute la différence du mode sémantique.

  _createPairedImages(collection, difficulty) {
    const numPairs = PAIR_COUNTS[difficulty] ?? 4;
    const pairs    = collection.slice(0, numPairs);

    // pairId copié explicitement dans chaque objet carte
    // sinon card.image.pairId serait undefined et tout matche
    return pairs.flatMap(pair => [
      { ...pair.a, pairId: pair.pairId },
      { ...pair.b, pairId: pair.pairId },
    ]);
  }

  // Override 3
  // Game compare card1.image.id === card2.image.id (même image).
  // SemanticGame compare card1.image.pairId === card2.image.pairId
  // (images différentes mais appartenant à la même paire sémantique).

  _checkMatch() {
    const [idx1, idx2] = this._flippedCards;
    const card1 = this._cards[idx1];
    const card2 = this._cards[idx2];

    const matchSound = new Audio('assets/sounds/match.mp3');
    const wrongSound = new Audio('assets/sounds/flip_back.mp3');

    if (card1.image.pairId === card2.image.pairId) {
      card1.isMatched = true;
      card2.isMatched = true;
      this._remainingPairs--;
      this._combo++;

      this._domManager.markMatched(idx1);
      this._domManager.markMatched(idx2);

      if (this._combo >= 2) {
        this._playComboSound(this._combo);
        this._domManager.showComboBurst(this._combo);
      } else {
        matchSound.play().catch(() => {});
      }
    } else {
      card1.isFlipped = false;
      card2.isFlipped = false;
      this._combo = 0;
      this._domManager.unflipCard(idx1);
      this._domManager.unflipCard(idx2);
      wrongSound.play().catch(() => {});
    }

    if (this._remainingPairs === 0) {
      setTimeout(() => this._endGame(), 500);
    }

    this._flippedCards = [];
    this._isChecking   = false;
  }
}
