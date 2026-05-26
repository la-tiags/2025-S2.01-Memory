import { imageCollections } from './ImageCollection.js';
import { ApiService }        from './ApiService.js';
import { DOMManager }        from './DOMManager.js';
import { Timer }             from './Timer.js';

const wrongSound = new Audio('assets/sounds/flip_back.mp3');
const matchSound = new Audio('assets/sounds/match.mp3');
const comboSounds = [
  new Audio('assets/sounds/combo.mp3'),
  new Audio('assets/sounds/combo2.mp3'),
  new Audio('assets/sounds/combo3.mp3'),
  new Audio('assets/sounds/combo4.mp3'),
  new Audio('assets/sounds/combo5.mp3'),
  new Audio('assets/sounds/combo6.mp3'),
  new Audio('assets/sounds/combo7.mp3'),
];
const winSound = new Audio('assets/sounds/win.mp3');
const loseSound = new Audio('assets/sounds/lose.mp3');

const PAIR_COUNTS = Object.freeze({
  1: 4,
  2: 6,
  3: 8,
});

export class Game {
  // ── Champs passés de #privé à _protégé ──────────────────────────
  // Raison : SemanticGame hérite de Game et doit accéder à ces champs
  // dans ses overrides de _checkMatch() et _createPairedImages()
  // Convention _ = "protégé" (accessible aux sous-classes, pas au code externe)

  /** @type {number} */
  _gameId = null;

  /** @type {DOMManager} */
  _domManager = new DOMManager();

  /** @type {Timer} */
  _timer = new Timer((seconds) => {
    this._domManager.updateTimer(Timer.format(seconds));
  }, () => this._endGame());

  /** @type {number} */
  _remainingPairs = 0;

  /** @type {Array<{ index: number, image: object, isFlipped: boolean, isMatched: boolean }>} */
  _cards = [];

  /** @type {number[]} */
  _flippedCards = [];

  /** @type {boolean} */
  _isChecking = false;

  /** @type {number} */
  _moves = 0;

  /** @type {number} */
  _combo = 0;

  // ─── API publique ──────────────────────────────────────────────────────────

  startGame(id) {
    this._gameId = id;

    const { difficulty, collectionName } = this._domManager.getFormValues();

    const collection = imageCollections[collectionName];
    if (!collection) {
      this._domManager.showError(`Collection inconnue : "${collectionName}"`);
      return;
    }

    const pairedImages    = this._createPairedImages(collection, difficulty);
    this._remainingPairs  = pairedImages.length / 2;

    this._buildCards(pairedImages);
    this._domManager.showGame();
    this._combo = 0;
    this._timer.start();
    this._domManager.updateMoves(this._moves);
  }

  abandonGame() {
    this._domManager.showConfirmModal(
      'Es-tu sûr de vouloir abandonner la partie ?',
      () => this._endGame(),
    );
  }

  // ─── Logique de jeu ────────────────────────────────────────────────────────

  _handleCardClick(cardIndex) {
    if (this._isChecking) return;

    const card = this._cards[cardIndex];
    if (!card || card.isMatched || card.isFlipped) return;

    card.isFlipped = true;
    this._flippedCards.push(cardIndex);
    this._domManager.flipCard(cardIndex);
    const flipSoundInstance = new Audio('assets/sounds/flip.mp3');
    flipSoundInstance.play().catch(() => {});

    if (this._flippedCards.length === 2) {
      this._moves++;
      this._domManager.updateMoves(this._moves);
      this._isChecking = true;
      // ── Appel via this. pour que SemanticGame puisse override ──
      setTimeout(() => this._checkMatch(), 500);
    }
  }

  /**
   * Vérifie si les deux cartes retournées forment une paire.
   * Overridé par SemanticGame pour comparer pairId au lieu de image.id
   */
  _checkMatch() {
    const [idx1, idx2] = this._flippedCards;
    const card1 = this._cards[idx1];
    const card2 = this._cards[idx2];

    if (card1.image.id === card2.image.id) {
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

  async _endGame() {
    const seconds = this._timer.seconds;
    const moves   = this._moves;
    const won     = this._remainingPairs === 0;
    this._timer.stop();

    if (won) winSound.play();
    else     loseSound.play();

    try {
      await ApiService.updateGameResult(this._gameId, this._remainingPairs);
    } catch (error) {
      console.error('Erreur fin de partie :', error);
    }

    this._domManager.showEndScreen(won, moves, this._remainingPairs, seconds, () => {
      this._resetState();
      this._domManager.showSetup();
    });
  }

  // ─── Construction du plateau ───────────────────────────────────────────────

  _buildCards(pairedImages) {
    this._cards = pairedImages.map((image, index) => ({
      index,
      image,
      isFlipped:  false,
      isMatched:  false,
    }));

    this._shuffleArray(this._cards);
    this._cards.forEach((card, i) => { card.index = i; });
    this._flippedCards = [];

    this._domManager.createCards(
      this._cards,
      (cardIndex) => this._handleCardClick(cardIndex),
    );
  }

  /**
   * Sélectionne les images et les double pour créer les paires.
   * Overridé par SemanticGame pour retourner des paires d'images différentes.
   */
  _createPairedImages(collection, difficulty) {
    if (!(difficulty in PAIR_COUNTS)) {
      throw new Error(`Difficulté invalide : ${difficulty}.`);
    }

    const numPairs       = PAIR_COUNTS[difficulty];
    const selectedImages = collection.slice(0, numPairs);

    if (selectedImages.length < numPairs) {
      console.warn(`La collection ne contient que ${selectedImages.length} image(s) sur ${numPairs} demandées.`);
    }

    return selectedImages.flatMap(image => [image, image]);
  }

  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  _playComboSound(combo) {
    const index = Math.min(combo - 2, comboSounds.length - 1);
    const sound = comboSounds[index];
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  _resetState() {
    this._cards          = [];
    this._flippedCards   = [];
    this._moves          = 0;
    this._combo          = 0;
    this._remainingPairs = 0;
    this._timer.reset();
  }
}
