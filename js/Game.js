import { imageCollections } from './ImageCollection.js';
import { ApiService }        from './ApiService.js';
import { DOMManager }        from './DOMManager.js';
import { Timer }             from './Timer.js';

/**
 * Nombre de paires selon le niveau de difficulté.
 * Extrait en constante de module pour éviter de recréer l'objet à chaque partie.
 */
const PAIR_COUNTS = Object.freeze({
  1: 4,   // Facile        : 4 paires  (8  cartes)
  2: 6,   // Intermédiaire : 6 paires  (12 cartes)
  3: 8,   // Expert        : 8 paires  (16 cartes)
});

export class Game {
  /** @type {number} Identifiant de la partie en cours */
  #id;

  /** @type {DOMManager} */
  #domManager = new DOMManager();

  /** @type {Timer} */
  #timer = new Timer((seconds) => {
    this.#domManager.updateTimer(Timer.format(seconds));
  });

  /** @type {number} Nombre de paires restantes à trouver */
  #remainingPairs = 0;

  /** @type {Array<{ index: number, image: object, isFlipped: boolean, isMatched: boolean }>} */
  #cards = [];

  /** @type {number[]} Indices des cartes actuellement retournées (max 2) */
  #flippedCards = [];

  /** @type {boolean} Verrou pendant la vérification d'une paire */
  #isChecking = false;

  // ─── API publique ──────────────────────────────────────────────────────────

  /**
   * Démarre une nouvelle partie.
   * @param {number} id - Identifiant de partie fourni par le serveur
   */
  startGame(id) {
    this.#id = id;

    const { difficulty, collectionName } = this.#domManager.getFormValues();

    const collection = imageCollections[collectionName];
    if (!collection) {
      this.#domManager.showError(`Collection inconnue : "${collectionName}"`);
      return;
    }

    const pairedImages    = this.#createPairedImages(collection, difficulty);
    this.#remainingPairs  = pairedImages.length / 2;

    this.#buildCards(pairedImages);
    this.#domManager.showGame();
    this.#timer.start();
  }

  /**
   * Demande confirmation avant d'abandonner la partie.
   */
  abandonGame() {
    this.#domManager.showConfirmModal(
      'Es-tu sûr de vouloir abandonner la partie ?',
      () => this.#endGame(),
    );
  }

  // ─── Logique de jeu ────────────────────────────────────────────────────────

  /**
   * Gère le clic sur une carte.
   * @param {number} cardIndex
   */
  #handleCardClick(cardIndex) {
    if (this.#isChecking) return;

    const card = this.#cards[cardIndex];
    if (!card || card.isMatched || card.isFlipped) return;

    card.isFlipped = true;
    this.#flippedCards.push(cardIndex);
    this.#domManager.flipCard(cardIndex);

    if (this.#flippedCards.length === 2) {
      this.#isChecking = true;
      setTimeout(() => this.#checkMatch(), 500);
    }
  }

  /**
   * Vérifie si les deux cartes retournées forment une paire.
   */
  #checkMatch() {
    const [idx1, idx2] = this.#flippedCards;
    const card1 = this.#cards[idx1];
    const card2 = this.#cards[idx2];

    if (card1.image.id === card2.image.id) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.#remainingPairs--;

      this.#domManager.markMatched(idx1);
      this.#domManager.markMatched(idx2);

      if (this.#remainingPairs === 0) {
        setTimeout(() => this.#endGame(), 500);
      }
    } else {
      card1.isFlipped = false;
      card2.isFlipped = false;
      this.#domManager.unflipCard(idx1);
      this.#domManager.unflipCard(idx2);
    }

    this.#flippedCards = [];
    this.#isChecking   = false;
  }

  /**
   * Termine la partie (victoire ou abandon) et envoie le résultat au serveur.
   */
  async #endGame() {
    this.#timer.stop();

    try {
      const result = await ApiService.updateGameResult(this.#id, this.#remainingPairs);
      console.log('Fin de partie :', result);
      this.#resetState();
      this.#domManager.showSetup();
    } catch (error) {
      console.error('Erreur fin de partie :', error);
      this.#domManager.showError(error.message || 'Erreur lors de la fin de la partie');
      // On ne redirige pas vers le formulaire : le joueur peut réessayer
    }
  }

  // ─── Construction du plateau ───────────────────────────────────────────────

  /**
   * Crée, mélange et affiche les cartes.
   * @param {object[]} pairedImages
   */
  #buildCards(pairedImages) {
    this.#cards = pairedImages.map((image, index) => ({
      index,
      image,
      isFlipped:  false,
      isMatched:  false,
    }));

    this.#shuffleArray(this.#cards);

    // Réassigner les index APRÈS le mélange pour que data-index
    // corresponde à la position réelle dans this.#cards
    this.#cards.forEach((card, i) => { card.index = i; });

    this.#flippedCards = [];

    this.#domManager.createCards(
      this.#cards,
      (cardIndex) => this.#handleCardClick(cardIndex),
    );
  }

  /**
   * Sélectionne les images et les double pour créer les paires.
   * @param {object[]} collection
   * @param {number}   difficulty
   * @returns {object[]}
   * @throws {Error} si la difficulté est invalide
   */
  #createPairedImages(collection, difficulty) {
    if (!(difficulty in PAIR_COUNTS)) {
      throw new Error(`Difficulté invalide : ${difficulty}. Valeurs attendues : ${Object.keys(PAIR_COUNTS).join(', ')}`);
    }

    const numPairs      = PAIR_COUNTS[difficulty];
    const selectedImages = collection.slice(0, numPairs);

    if (selectedImages.length < numPairs) {
      console.warn(`La collection ne contient que ${selectedImages.length} image(s) sur ${numPairs} demandées.`);
    }

    return selectedImages.flatMap(image => [image, image]);
  }

  /**
   * Mélange un tableau en place (Fisher-Yates).
   * @param {Array} array
   */
  #shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Réinitialise l'état interne du jeu (sans toucher au DOM).
   */
  #resetState() {
    this.#cards          = [];
    this.#flippedCards   = [];
    this.#remainingPairs = 0;
    this.#timer.reset();
  }
}
